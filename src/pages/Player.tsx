import { useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Home, Play } from 'lucide-react';
import {
  getMovieDetails,
  getTVShowDetails,
  MovieDetails,
  TVShowDetails,
} from '@/services/tmdb';
import StreamPlayer from '@/components/StreamPlayer';
import { PlayerSkeleton } from '@/components/ContentSkeletons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { saveToContinueWatching } from '@/lib/continueWatching';
import { easeOutExpo } from '@/lib/motion';

const Player = () => {
  const { type, id } = useParams<{ type: string; id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
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
    return <PlayerSkeleton />;
  }

  if (!item) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <div className="glass rounded-3xl px-8 py-10 text-center">
          <h1 className="text-2xl font-bold text-white">Content not found</h1>
          <p className="mt-2 text-sm text-white/45">
            This title is unavailable or the link is invalid.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="brand-gradient mt-6 inline-flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-semibold text-white"
          >
            <ChevronLeft size={16} /> Go back
          </button>
        </div>
      </div>
    );
  }

  const title = movieItem ? movieItem.title : tvItem?.name || '';
  const date = movieItem ? movieItem.release_date : tvItem?.first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';

  const handleSeasonChange = (s: string) => {
    setSearchParams({ s, e: '1' });
  };

  const handleEpisodeChange = (e: string) => {
    setSearchParams({ s: String(season), e });
  };

  const episodeCount =
    tvItem?.seasons?.find((s) => s.season_number === season)?.episode_count || 0;

  return (
    <div className="min-h-screen px-4 pb-16 pt-5 md:px-8 md:pt-7">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: easeOutExpo }}
        className="glass mx-auto mb-6 flex max-w-6xl items-center justify-between gap-4 rounded-2xl px-4 py-3"
      >
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="line-clamp-1 font-display text-base font-semibold text-white md:text-lg">
              {title}
            </h1>
            {!isMovie && (
              <p className="flex items-center gap-1 text-xs text-white/45">
                <span>Season {season}</span>
                <ChevronRight size={11} />
                <span>Episode {episode}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          {!isMovie && tvItem && (
            <div className="hidden items-center gap-2 md:flex">
              <Select value={String(season)} onValueChange={handleSeasonChange}>
                <SelectTrigger className="h-10 w-[120px] rounded-xl border-white/10 bg-white/[0.05] text-xs text-white/80 focus:ring-primary/50">
                  <SelectValue placeholder="Season" />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10 text-white">
                  {tvItem.seasons
                    ?.filter((s) => s.season_number > 0)
                    .map((s) => (
                      <SelectItem key={s.id} value={String(s.season_number)}>
                        Season {s.season_number}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Select value={String(episode)} onValueChange={handleEpisodeChange}>
                <SelectTrigger className="h-10 w-[120px] rounded-xl border-white/10 bg-white/[0.05] text-xs text-white/80 focus:ring-primary/50">
                  <SelectValue placeholder="Episode" />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/10 text-white">
                  {Array.from({ length: episodeCount }).map((_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>
                      Episode {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Link
            to="/"
            aria-label="Home"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.05] text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Home size={19} />
          </Link>
        </div>
      </motion.header>

      {/* Player */}
      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOutExpo, delay: 0.05 }}
        className="mx-auto max-w-6xl"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black shadow-[0_40px_120px_-40px_hsl(var(--brand-glow)/0.45)]">
          <StreamPlayer
            id={itemId}
            imdbId={movieItem ? movieItem.imdb_id : tvItem?.external_ids?.imdb_id}
            type={type as 'movie' | 'tv' | 'anime'}
            season={season}
            episode={episode}
            title={title}
          />
        </div>

        {/* Mobile selectors */}
        {!isMovie && tvItem && (
          <div className="mt-4 flex items-center gap-2 md:hidden">
            <Select value={String(season)} onValueChange={handleSeasonChange}>
              <SelectTrigger className="h-10 flex-1 rounded-xl border-white/10 bg-white/[0.05] text-xs text-white/80">
                <SelectValue placeholder="Season" />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10 text-white">
                {tvItem.seasons
                  ?.filter((s) => s.season_number > 0)
                  .map((s) => (
                    <SelectItem key={s.id} value={String(s.season_number)}>
                      S{s.season_number}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Select value={String(episode)} onValueChange={handleEpisodeChange}>
              <SelectTrigger className="h-10 flex-1 rounded-xl border-white/10 bg-white/[0.05] text-xs text-white/80">
                <SelectValue placeholder="Episode" />
              </SelectTrigger>
              <SelectContent className="glass-strong border-white/10 text-white">
                {Array.from({ length: episodeCount }).map((_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>
                    E{i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Meta */}
        <div className="glass mt-6 rounded-3xl p-5 md:p-7">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="brand-gradient flex h-10 w-10 items-center justify-center rounded-xl text-white">
                <Play size={17} fill="currentColor" className="ml-0.5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-bold text-white md:text-2xl">
                  {title}
                </h2>
                <p className="text-xs text-white/40">
                  {year}
                  {movieItem?.runtime
                    ? ` • ${Math.floor(movieItem.runtime / 60)}h ${movieItem.runtime % 60}m`
                    : ''}
                </p>
              </div>
            </div>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
              {type}
            </span>
          </div>

          <div className="my-5 h-px w-full bg-white/[0.06]" />

          <p className="max-w-4xl text-sm leading-relaxed text-white/60">
            {item.overview}
          </p>
        </div>
      </motion.main>
    </div>
  );
};

export default Player;
