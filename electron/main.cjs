const { app, BrowserWindow, shell, Menu, net } = require('electron');
const path = require('path');
const { setupAdblock } = require('./adblock.cjs');

const CONFIG_URL = 'https://forzayt.github.io/F_Flix/src/config/url.json';

/** Links that are allowed to open in the user's real browser. */
const EXTERNAL_ALLOWLIST = new Set(['github.com', 'www.github.com']);

function isTrustedExternal(url) {
  try {
    const { protocol, hostname } = new URL(url);
    return (
      protocol === 'https:' &&
      (EXTERNAL_ALLOWLIST.has(hostname) || hostname.endsWith('.github.com'))
    );
  } catch {
    return false;
  }
}

function isSameOrigin(url, originUrl) {
  try {
    return new URL(url).origin === new URL(originUrl).origin;
  } catch {
    return false;
  }
}

async function fetchTargetUrl() {
  const fetchFn = net?.fetch || fetch;
  const response = await fetchFn(CONFIG_URL, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Failed to fetch config: HTTP ${response.status}`);
  const data = await response.json();
  if (!data?.url) throw new Error('No URL field found in config');
  return data.url;
}

function loadErrorPage(window, errorMessage) {
  const errorHtml = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Connection Error</title><style>body{margin:0;height:100vh;display:flex;align-items:center;justify-content:center;background:#0f172a;color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;text-align:center}.container{max-width:480px;padding:32px}h1{font-size:24px;margin-bottom:12px}p{color:#94a3b8;font-size:14px;margin-bottom:24px}button{background:#e50914;color:white;border:0;padding:10px 24px;font-size:14px;font-weight:600;border-radius:6px;cursor:pointer}button:hover{background:#b80710}</style></head><body><div class="container"><h1>Unable to load configuration</h1><p>${errorMessage || 'Please check your internet connection and try again.'}</p><button onclick="window.location.reload()">Retry</button></div></body></html>`;
  window.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(errorHtml)}`);
}

/**
 * Lock the window down so ad frames cannot spawn popups, redirect the main
 * window, or ask for notifications/geolocation. This complements the network
 * blocker in adblock.cjs.
 */
function hardenWindow(mainWindow, targetUrl) {
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Only the handful of real external links open in the OS browser.
    if (isTrustedExternal(url)) shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!isSameOrigin(url, targetUrl)) event.preventDefault();
  });

  mainWindow.webContents.on(
    'will-redirect',
    (event, url, _isInPlace, isMainFrame) => {
      if (isMainFrame && !isSameOrigin(url, targetUrl)) event.preventDefault();
    }
  );
}

async function loadApp(mainWindow) {
  try {
    const targetUrl = await fetchTargetUrl();
    hardenWindow(mainWindow, targetUrl);
    mainWindow.loadURL(targetUrl);
  } catch (error) {
    loadErrorPage(mainWindow, error.message);
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280, height: 800, minWidth: 900, minHeight: 600, title: 'F-Flix',
    icon: path.join(__dirname, 'icon.ico'), backgroundColor: '#0f172a', autoHideMenuBar: true,
    webPreferences: { nodeIntegration: false, contextIsolation: true, sandbox: true },
  });
  Menu.setApplicationMenu(null);
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    if (!validatedURL.startsWith('data:text/html')) loadErrorPage(mainWindow, errorDescription);
  });
  loadApp(mainWindow);
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
      if (windows[0].isMinimized()) windows[0].restore();
      windows[0].focus();
    }
  });
  app.whenReady().then(() => {
    // Kick off ad blocking before the first page load. The built-in blocklist
    // is installed synchronously; the EasyList engine attaches when ready.
    void setupAdblock().catch((error) => {
      console.warn('[adblock] Setup failed:', error?.message || error);
    });
    createWindow();
    app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
  });
}
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
