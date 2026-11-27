import { useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import {
  getMovieDetails,
  getTVShowDetails,
  MovieDetails,
  TVShowDetails,
} from '@/services/tmdb';
import StreamPlayer from '@/components/StreamPlayer';
import { saveToContinueWatching } from '@/lib/continueWatching';

const Player = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const itemId = Number(id);
  const season = Number(searchParams.get('s')) || 1;
  const episode = Number(searchParams.get('e')) || 1;

  const { data: item, isLoading } = useQuery({
    queryKey: [type, itemId],
    queryFn: async () => {
      if (type === 'movie') return getMovieDetails(itemId);
      return getTVShowDetails(itemId);
    },
    enabled: !!itemId && (type === 'movie' || type === 'tv' || type === 'anime'),
  });

  const isMovie = type === 'movie';
  const movieItem = isMovie ? (item as MovieDetails) : null;
  const tvItem = !isMovie ? (item as TVShowDetails) : null;

  useEffect(() => {
    if (item) {
      saveToContinueWatching({
        id: itemId,
        type: type as 'movie' | 'tv' | 'anime',
        title: movieItem ? movieItem.title : tvItem?.name || '',
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        season: isMovie ? undefined : season,
        episode: isMovie ? undefined : episode,
        timestamp: Date.now(),
      });
    }
  }, [item, itemId, type, season, episode, isMovie, movieItem, tvItem]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-black px-4">
        <p className="text-xl font-semibold text-white">Content not found</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-white/10 px-6 text-sm font-semibold text-white hover:bg-white/20"
        >
          <ArrowLeft size={16} /> Go back
        </button>
      </div>
    );
  }

  const title = movieItem ? movieItem.title : tvItem?.name || '';

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Minimal floating back button */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="fixed left-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white/75 backdrop-blur-md transition-colors hover:bg-black/80 hover:text-white"
      >
        <ArrowLeft size={20} />
      </button>

      {/* Full-viewport player */}
      <StreamPlayer
        id={itemId}
        imdbId={movieItem ? movieItem.imdb_id : tvItem?.external_ids?.imdb_id}
        type={type as 'movie' | 'tv' | 'anime'}
        season={season}
        episode={episode}
        title={title}
        preferredSourceId={searchParams.get('source')}
        fill
      />
    </div>
  );
};

export default Player;
