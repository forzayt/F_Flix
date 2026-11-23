export interface StreamSourceOptions {
    /** TMDB id of the movie / show */
    id: number;
    /** IMDb id, used by sources that require it */
    imdbId?: string | null;
    type: 'movie' | 'tv' | 'anime';
    season: number;
    episode: number;
}

export interface StreamSource {
    id: string;
    name: string;
    /** Base embed domain. Update this when a provider changes domains. */
    url: string;
    buildUrl: (options: StreamSourceOptions) => string;
    /**
     * CORS-enabled availability endpoint. Returns 404 when the title / episode
     * isn't in the provider's catalogue, which lets the player skip it.
     * Sources without this are treated as available (last-resort fallbacks).
     */
    getAvailabilityUrl?: (options: StreamSourceOptions) => string;
}

const PRIMARY_COLOR = 'E11D48';
const PROBE_TIMEOUT_MS = 4000;

const getSeason = (type: StreamSourceOptions['type'], season: number) =>
    type === 'anime' ? 1 : season;

// --- VixSrc ---------------------------------------------------------------
const VIXSRC_BASE = 'https://vixsrc.to';

const buildVixSrcUrl = ({ id, type, season, episode }: StreamSourceOptions) => {
    const params = new URLSearchParams({
        primaryColor: PRIMARY_COLOR,
        autoplay: 'true',
        nextEpisode: 'true',
        episodeSelector: 'true',
        overlay: 'true',
    }).toString();

    if (type === 'movie') {
        return `${VIXSRC_BASE}/movie/${id}?${params}`;
    }
    return `${VIXSRC_BASE}/tv/${id}/${getSeason(type, season)}/${episode}?${params}`;
};

// --- VidSrc (vidsrc.sh) ---------------------------------------------------
const VIDSRC_BASE = 'https://vidsrc.sh';

const buildVidSrcUrl = ({ id, type, season, episode }: StreamSourceOptions) => {
    if (type === 'movie') {
        return `${VIDSRC_BASE}/embed/movie/${id}`;
    }
    return `${VIDSRC_BASE}/embed/tv/${id}/${getSeason(type, season)}/${episode}`;
};

const getVidSrcAvailabilityUrl = ({ id, type, season, episode }: StreamSourceOptions) => {
    if (type === 'movie') {
        return `${VIDSRC_BASE}/info/movie/${id}.json`;
    }
    return `${VIDSRC_BASE}/info/tv/${id}/${getSeason(type, season)}/${episode}.json`;
};

// --- VSEmbed --------------------------------------------------------------
const VSEMBED_BASE = 'https://vsembed.ru';

const buildVsEmbedUrl = ({ id, type, season, episode }: StreamSourceOptions) => {
    if (type === 'movie') {
        return `${VSEMBED_BASE}/embed/movie/${id}`;
    }
    return `${VSEMBED_BASE}/embed/tv/${id}/${getSeason(type, season)}/${episode}`;
};

const getVsEmbedAvailabilityUrl = ({ id, type, season, episode }: StreamSourceOptions) => {
    if (type === 'movie') {
        return `${VSEMBED_BASE}/info/movie/${id}.json`;
    }
    return `${VSEMBED_BASE}/info/tv/${id}/${getSeason(type, season)}/${episode}.json`;
};

// --- VidCore --------------------------------------------------------------
const VIDCORE_BASE = 'https://www.vidcore.net';

const buildVidCoreUrl = ({ id, type, season, episode }: StreamSourceOptions) => {
    if (type === 'movie') {
        return `${VIDCORE_BASE}/movie/${id}`;
    }
    return `${VIDCORE_BASE}/tv/${id}/${getSeason(type, season)}/${episode}`;
};

// --- VidFast --------------------------------------------------------------
const VIDFAST_BASE = 'https://vidfast.vc';

const buildVidFastUrl = ({ id, type, season, episode }: StreamSourceOptions) => {
    if (type === 'movie') {
        return `${VIDFAST_BASE}/movie/${id}?autoPlay=true`;
    }
    return `${VIDFAST_BASE}/tv/${id}/${getSeason(type, season)}/${episode}?autoPlay=true`;
};

// --- VidNest --------------------------------------------------------------
const VIDNEST_BASE = 'https://vidnest.fun';

const buildVidNestUrl = ({ id, type, season, episode }: StreamSourceOptions) => {
    if (type === 'movie') {
        return `${VIDNEST_BASE}/movie/${id}`;
    }
    return `${VIDNEST_BASE}/tv/${id}/${getSeason(type, season)}/${episode}`;
};

/**
 * Priority order. Sources with a `getAvailabilityUrl` are checked before use,
 * so titles missing from one provider automatically fall through to the next.
 * The remaining sources are optimistic fallbacks (their players don't expose a
 * CORS-friendly availability API).
 */
export const STREAM_SOURCES: StreamSource[] = [
    {
        id: 'vidsrc',
        name: 'VidSrc',
        url: VIDSRC_BASE,
        buildUrl: buildVidSrcUrl,
        getAvailabilityUrl: getVidSrcAvailabilityUrl,
    },
    {
        id: 'vsembed',
        name: 'VSEmbed',
        url: VSEMBED_BASE,
        buildUrl: buildVsEmbedUrl,
        getAvailabilityUrl: getVsEmbedAvailabilityUrl,
    },
    {
        id: 'vidcore',
        name: 'VidCore',
        url: VIDCORE_BASE,
        buildUrl: buildVidCoreUrl,
    },
    {
        id: 'vidfast',
        name: 'VidFast',
        url: VIDFAST_BASE,
        buildUrl: buildVidFastUrl,
    },
    {
        id: 'vidnest',
        name: 'VidNest',
        url: VIDNEST_BASE,
        buildUrl: buildVidNestUrl,
    },
    {
        id: 'vixsrc',
        name: 'VixSrc',
        url: VIXSRC_BASE,
        buildUrl: buildVixSrcUrl,
    },
];

const isSourceAvailable = async (url: string, signal?: AbortSignal) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    const abortProbe = () => controller.abort();

    signal?.addEventListener('abort', abortProbe);

    try {
        const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
        return response.ok;
    } catch {
        return false;
    } finally {
        clearTimeout(timer);
        signal?.removeEventListener('abort', abortProbe);
    }
};

/**
 * Picks the first source that is reachable and has the requested title.
 * Falls back to the last (unprobeable) source when every probe fails, so a
 * blocked probe request never leaves the player empty.
 */
export const resolveStreamSource = async (
    options: StreamSourceOptions,
    signal?: AbortSignal,
): Promise<StreamSource> => {
    let fallback: StreamSource | null = null;

    for (const source of STREAM_SOURCES) {
        if (signal?.aborted) break;

        if (!source.getAvailabilityUrl) {
            fallback ??= source;
            continue;
        }

        if (await isSourceAvailable(source.getAvailabilityUrl(options), signal)) {
            return source;
        }
    }

    return fallback ?? STREAM_SOURCES[STREAM_SOURCES.length - 1];
};
