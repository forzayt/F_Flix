import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Clock,
  Eye,
  Globe,
  Play,
  Star,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getSimilarMovies,
  getBackdropUrl,
} from '@/services/tmdb';
import CastSection from '@/components/CastSection';
import MovieRow from '@/components/MovieRow';
import { DetailsSkeleton } from '@/components/ContentSkeletons';
import { easeOutExpo } from '@/lib/motion';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const movieId = Number(id);

  const { data: movie, isLoading } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: !!movieId,
  });

  const { data: videos } = useQuery({
    queryKey: ['movieVideos', movieId],
    queryFn: () => getMovieVideos(movieId),
    enabled: !!movieId,
  });

  const { data: credits } = useQuery({
    queryKey: ['movieCredits', movieId],
    queryFn: () => getMovieCredits(movieId),
    enabled: !!movieId,
  });

  const { data: similar } = useQuery({
    queryKey: ['similarMovies', movieId],
    queryFn: () => getSimilarMovies(movieId),
    enabled: !!movieId,
  });

  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const trailer =
    videos?.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
    videos?.results[0];

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <DetailsSkeleton />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <div className="glass rounded-3xl px-8 py-10 text-center">
          <p className="text-xl font-semibold text-white">Movie not found</p>
          <p className="mt-2 text-sm text-white/45">It may have been removed or the link is invalid.</p>
          <button
            onClick={() => navigate(-1)}
            className="brand-gradient mt-6 inline-flex h-11 items-center gap-2 rounded-2xl px-5 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} /> Go back
          </button>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const releaseDate = movie.release_date ? new Date(movie.release_date) : null;
  const formattedDate = releaseDate
    ? releaseDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'N/A';
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : 'N/A';

  return (
    <div className="min-h-screen text-white">
      {/* Hero */}
      <div className="relative h-[88vh] min-h-[620px] w-full overflow-hidden md:-ml-[84px]">
        {trailer ? (
          <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${
                isMuted ? 1 : 0
              }&controls=0&loop=1&playlist=${trailer.key}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&vq=hd1080`}
              className="h-full w-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            <button
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Unmute trailer' : 'Mute trailer'}
              className="glass pointer-events-auto absolute bottom-28 right-10 z-40 flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white md:right-16"
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        ) : backdropUrl ? (
          <img
            src={backdropUrl}
            alt={movie.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/80 via-black/25 to-transparent" />

        <button
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="glass absolute left-4 top-20 z-50 flex h-11 w-11 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white md:left-[108px] md:top-24"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="absolute inset-0 flex items-end pb-24 md:items-center md:pb-0">
          <div className="w-full px-5 md:pl-[132px] md:pr-16">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOutExpo }}
              className="max-w-3xl space-y-5"
            >
              <div className="flex flex-wrap items-center gap-2">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/60 backdrop-blur-md"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white text-shadow sm:text-5xl md:text-7xl">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/65">
                <span className="flex items-center gap-1.5">
                  <Star size={15} className="fill-amber-400 text-amber-400" />
                  <span className="text-white">{movie.vote_average.toFixed(1)}</span>
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span>{formattedDate}</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1.5">
                  <Clock size={15} />
                  {runtime}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1.5">
                  <Eye size={15} />
                  {Math.floor(movie.popularity * 100).toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <p
                  className={`max-w-2xl text-sm leading-relaxed text-white/70 md:text-base ${
                    !isOverviewExpanded && 'line-clamp-3'
                  }`}
                >
                  {movie.overview}
                </p>
                {movie.overview.length > 200 && (
                  <button
                    onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                    className="text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:text-primary/80"
                  >
                    {isOverviewExpanded ? 'Read less' : 'Read more'}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate(`/watch/movie/${movie.id}?autoplay=true`)}
                  className="brand-gradient glow-primary inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Play size={17} fill="currentColor" />
                  Start watching
                </button>

                <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3 text-xs text-white/55">
                  <Globe size={15} />
                  {movie.spoken_languages && movie.spoken_languages.length > 0
                    ? movie.spoken_languages.map((l) => l.name).join(', ')
                    : 'English'}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 -mt-16 px-4 pb-24 md:px-12">
        <div className="glass-highlight glass grid grid-cols-2 gap-4 rounded-3xl p-5 md:grid-cols-4 md:p-6">
          {[
            { label: 'Rating', value: movie.vote_average.toFixed(1) },
            { label: 'Votes', value: movie.vote_count.toLocaleString() },
            { label: 'Status', value: movie.status },
            { label: 'Tagline', value: movie.tagline || 'N/A' },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/[0.03] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                {stat.label}
              </p>
              <p className="mt-1.5 line-clamp-2 text-sm font-semibold text-white/90">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {credits?.cast && <CastSection cast={credits.cast} />}

        {similar?.results && similar.results.length > 0 && (
          <MovieRow
            title="Similar Movies"
            items={similar.results}
            type="movie"
            className="mt-10"
          />
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
