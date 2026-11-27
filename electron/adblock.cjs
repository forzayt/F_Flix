'use strict';

/**
 * Electron-level ad blocking.
 *
 * The stream providers are third-party iframes, so the web app cannot touch
 * their DOM. The only place ads *can* be stopped is below the page, at the
 * Chromium network layer. This module does that in two stages:
 *
 *   1. A lightweight built-in blocklist is installed immediately. It needs no
 *      dependencies and works offline.
 *   2. If `@ghostery/adblocker-electron` is installed, the full
 *      EasyList + EasyPrivacy engine is loaded (cached on disk) and replaces
 *      the lightweight listener. This covers thousands of rotating ad hosts.
 */

const path = require('path');
const fs = require('fs');
const { app, net, session } = require('electron');

/**
 * Hosts used by ad networks, popunder/popup vendors and trackers.
 * Matched against the request hostname and all of its subdomains.
 */
const BLOCKED_DOMAINS = [
  // Google ads / analytics
  'doubleclick.net',
  'googlesyndication.com',
  'googleadservices.com',
  'googletagservices.com',
  'googletagmanager.com',
  'google-analytics.com',
  'adservice.google.com',
  '2mdn.net',

  // Ad exchanges / SSPs / DSPs
  'adnxs.com',
  'adnxs-simple.com',
  'adsrvr.org',
  'adform.net',
  'adroll.com',
  'amazon-adsystem.com',
  'bidswitch.net',
  'casalemedia.com',
  'contextweb.com',
  'criteo.com',
  'criteo.net',
  'districtm.io',
  'emxdgt.com',
  'gumgum.com',
  'indexexchange.com',
  'indexww.com',
  'lijit.com',
  'media.net',
  'openx.net',
  'pubmatic.com',
  'rubiconproject.com',
  'sharethrough.com',
  'smartadserver.com',
  'sovrn.com',
  'spotxchange.com',
  'spotx.tv',
  'springserve.com',
  'teads.tv',
  'tremorhub.com',
  'triplelift.com',
  'turn.com',
  'yieldlab.net',
  'yieldmo.com',
  'zedo.com',

  // Data brokers / trackers
  'adsymptotic.com',
  'agkn.com',
  'bluekai.com',
  'bluecava.com',
  'crwdcntrl.net',
  'demdex.net',
  'drawbridge.com',
  'everesttech.net',
  'exelator.com',
  'krxd.net',
  'liveramp.com',
  'mathtag.com',
  'omtrdc.net',
  'quantcast.com',
  'quantserve.com',
  'rlcdn.com',
  'scorecardresearch.com',
  'tapad.com',

  // Popunder / popup networks
  'adcash.com',
  'ad-maven.com',
  'ad-maven.net',
  'adnium.com',
  'adnow.com',
  'adpushup.com',
  'adreactor.com',
  'adskeeper.com',
  'adspyglass.com',
  'adspyglass.net',
  'adsterra.com',
  'adsterra.net',
  'adsterra.org',
  'adsupply.com',
  'adversal.com',
  'bidvertiser.com',
  'chitika.com',
  'clickadu.com',
  'clickadilla.com',
  'clickaine.com',
  'highperformanceformat.com',
  'hilltopads.com',
  'hilltopads.net',
  'infolinks.com',
  'kontera.com',
  'mellowads.com',
  'monetag.com',
  'onclck.com',
  'onclck.pro',
  'onclckds.com',
  'popads.net',
  'popcash.net',
  'popmyads.com',
  'popunder.net',
  'popunder.pro',
  'popunderjs.com',
  'popunderzone.com',
  'profitablecpmrate.com',
  'propellerads.com',
  'propellerads.net',
  'propellerclick.com',
  'propu.sh',
  'topcreativeformat.com',

  // Adult ad networks commonly used by pirate embeds
  'exoclick.com',
  'exocdn.com',
  'exosrv.com',
  'juicyads.com',
  'juicyads.net',
  'juicycdn.com',
  'pemsrv.com',
  'realsrv.com',
  'trafficjunky.com',
  'trafficjunky.net',
  'trafficstars.com',
  'tsyndicate.com',

  // Native / content recommendation ads
  'mgid.com',
  'outbrain.com',
  'revcontent.com',
  'taboola.com',
  'zergnet.com',

  // Analytics / session replay / push-notification spam
  'amplitude.com',
  'chartbeat.com',
  'clevertap.com',
  'crazyegg.com',
  'fullstory.com',
  'heapanalytics.com',
  'hotjar.com',
  'inspectlet.com',
  'izooto.com',
  'kissmetrics.com',
  'leanplum.com',
  'luckyorange.com',
  'mixpanel.com',
  'moengage.com',
  'mouseflow.com',
  'onesignal.com',
  'optimizely.com',
  'parsely.com',
  'pushcrew.com',
  'pushengage.com',
  'pushwoosh.com',
  'segment.com',
  'segment.io',
  'sendpulse.com',
  'smartlook.com',
  'statcounter.com',
  'vwo.com',
  'webpushr.com',
  'wonderpush.com',

  // Crypto miners occasionally injected by these embeds
  'coin-hive.com',
  'coinhive.com',
  'coinimp.com',
  'crypto-loot.com',
  'cryptoloot.pro',
  'minero.cc',
  'webminepool.com',
];

/**
 * Request paths that are almost always ad delivery. Kept deliberately narrow
 * so normal video/image assets are not caught.
 */
const BLOCKED_PATH_PATTERNS = [
  /\/adsbygoogle/i,
  /\/pagead/i,
  /\/adserver/i,
  /\/adservice/i,
  /\/advertisement/i,
  /\/adframe/i,
  /\/popunder/i,
  /\/prebid/i,
  /\/vast\//i,
];

const EXTRA_FILTERS = BLOCKED_DOMAINS.map((domain) => `||${domain}^`);
const DOMAIN_SET = new Set(BLOCKED_DOMAINS.map((domain) => domain.toLowerCase()));

function matchesDomain(hostname, domain) {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

/** Returns true when a URL should be cancelled at the network layer. */
function isBlockedUrl(rawUrl) {
  let url;

  try {
    url = new URL(rawUrl);
  } catch {
    return false;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return false;
  }

  const hostname = url.hostname.toLowerCase();
  for (const domain of DOMAIN_SET) {
    if (matchesDomain(hostname, domain)) {
      return true;
    }
  }

  const pathAndQuery = `${url.pathname}${url.search}`;
  return BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(pathAndQuery));
}

/** Dependency-free blocker. Always installed first so blocking starts instantly. */
function installFallbackBlocker(ses) {
  ses.webRequest.onBeforeRequest({ urls: ['<all_urls>'] }, (details, callback) => {
    callback({ cancel: isBlockedUrl(details.url) });
  });
}

/** Load the EasyList engine, using (and repairing) an on-disk cache. */
async function loadFullEngine(ElectronBlocker, fetchFn, cachePath) {
  const caching = {
    path: cachePath,
    read: fs.promises.readFile,
    write: fs.promises.writeFile,
  };

  try {
    return await ElectronBlocker.fromPrebuiltAdsAndTracking(fetchFn, caching);
  } catch (error) {
    // Corrupt cache or a partial download: drop it and retry once.
    if (fs.existsSync(cachePath)) {
      try {
        fs.unlinkSync(cachePath);
      } catch {
        // ignore
      }
      return ElectronBlocker.fromPrebuiltAdsAndTracking(fetchFn);
    }
    throw error;
  }
}

let activeBlocker = null;

async function setupAdblock() {
  const ses = session.defaultSession;

  // Block notification/geolocation/camera/mic prompts from ad frames while
  // still letting the player request fullscreen.
  ses.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === 'fullscreen' || permission === 'clipboard-sanitized-write');
  });

  installFallbackBlocker(ses);

  try {
    const { ElectronBlocker } = require('@ghostery/adblocker-electron');
    const fetchFn = (url, init) => net.fetch(url, init);
    const cachePath = path.join(app.getPath('userData'), 'adblock-engine.bin');

    activeBlocker = await loadFullEngine(ElectronBlocker, fetchFn, cachePath);

    // Add the extra networks used by the pirate embeds on top of EasyList.
    if (typeof activeBlocker.updateFromDiff === 'function') {
      try {
        activeBlocker.updateFromDiff({ added: EXTRA_FILTERS });
      } catch (error) {
        console.warn('[adblock] Could not merge extra filters:', error?.message || error);
      }
    }

    // Electron keeps only the last onBeforeRequest listener, so this replaces
    // the lightweight fallback installed above.
    activeBlocker.enableBlockingInSession(ses);
    console.log('[adblock] EasyList engine enabled');
  } catch (error) {
    console.warn(
      '[adblock] Full EasyList engine unavailable; using the built-in blocklist.',
      error?.message || error
    );
    console.warn('[adblock] Run "npm install" inside electron/ to enable full lists.');
  }

  return activeBlocker;
}

module.exports = { setupAdblock, isBlockedUrl, BLOCKED_DOMAINS };
