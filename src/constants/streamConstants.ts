export const STREAM_SOURCES = [
    {
        id: 'videasy',
        name: 'Server 1 (Videasy)',
        url: 'https://player.videasy.net'     // require tmdb id
    },
    {
        id: 'vidsrc',
        name: 'Server 2 (Vidsrc)',
        url: 'https://vidsrc-embed.ru/embed'    // require imdb id
    }
];

export const STREAM_BASE_URL = STREAM_SOURCES[0].url;
