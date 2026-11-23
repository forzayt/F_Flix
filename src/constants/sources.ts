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
    /** Source loaded automatically by the player */
    isDefault?: boolean;
    buildUrl: (options: StreamSourceOptions) => string;
}

const PRIMARY_COLOR = 'E11D48';

const buildVixSrcUrl = ({ id, type, season, episode }: StreamSourceOptions) => {
    const base = 'https://vixsrc.to';
    const params = new URLSearchParams({
        primaryColor: PRIMARY_COLOR,
        autoplay: 'true',
        nextEpisode: 'true',
        episodeSelector: 'true',
        overlay: 'true',
    }).toString();

    if (type === 'movie') {
        return `${base}/movie/${id}?${params}`;
    }
    // Anime entries are TV shows in TMDB, so they always use season 1.
    const seasonNumber = type === 'anime' ? 1 : season;
    return `${base}/tv/${id}/${seasonNumber}/${episode}?${params}`;
};

export const STREAM_SOURCES: StreamSource[] = [
    {
        id: 'vixsrc',
        name: 'VixSrc',
        url: 'https://vixsrc.to',
        isDefault: true,
        buildUrl: buildVixSrcUrl,
    },
];

export const DEFAULT_STREAM_SOURCE = STREAM_SOURCES.find((source) => source.isDefault) ?? STREAM_SOURCES[0];
