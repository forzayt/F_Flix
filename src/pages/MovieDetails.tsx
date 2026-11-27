import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  Film,
  Play,
  Share2,
  Star,
  X,
} from 'lucide-react';
import {
  getMovieDetails,
  getMovieVideos,
  getMovieCredits,
  getSimilarMovies,
  getBackdropUrl,
  getImageUrl,
} from '@/services/tmdb';
import { STREAM_SOURCES } from '@/constants/sources';
import { DetailsSkeleton } from '@/components/ContentSkeletons';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type PanelTab = 'streams' | 'cast' | 'similar';

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
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PanelTab>('streams');

  const trailer =
    videos?.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
    videos?.results[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <DetailsSkeleton />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-4">
        <div className="rounded-3xl bg-white/[0.05] px-8 py-10 text-center">
          <p className="text-xl font-semibold text-white">Movie not found</p>
          <p className="mt-2 text-sm text-white/45">
            It may have been removed or the link is invalid.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-[#22b365] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#27c470]"
          >
            <ArrowLeft size={16} /> Go back
          </button>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;
  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : null;
  const topCast = credits?.cast?.slice(0, 6) || [];
  const similarMovies = similar?.results?.slice(0, 12) || [];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white/90 md:h-screen md:overflow-hidden">
      {/* ───── Stremio Background + Scrim ───── */}
      {backdropUrl && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <img
            src={backdropUrl}
            alt={movie.title}
            className="h-full w-full object-cover object-right opacity-[0.62] transition-opacity duration-500"
          />
          <div
            className="absolute inset-0"
            style={{
              background: [
                'linear-gradient(90deg, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.86) 22%, rgba(0,0,0,0.60) 40%, rgba(0,0,0,0.20) 58%, rgba(0,0,0,0) 70%)',
                'linear-gradient(0deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.40) 26%, rgba(0,0,0,0) 46%)',
                'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 18%)',
              ].join(', '),
            }}
          />
        </div>
      )}

      {/* ───── Back Button ───── */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Go back"
        className="fixed left-4 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-xl text-white/60 transition-colors hover:bg-white/[0.05] hover:text-white md:left-8 md:top-6"
      >
        <ArrowLeft size={22} />
      </button>

      {/* ───── Main Two-Column Content ───── */}
      <div className="relative z-10 flex min-h-screen flex-col px-5 pb-24 pt-20 md:h-full md:flex-row md:justify-between md:gap-8 md:px-12 md:pb-6 md:pt-6">
        {/* ── Left Hero Column (Stremio Hero) ── */}
        <div className="flex flex-1 flex-col md:max-w-[50rem] md:overflow-y-auto md:pr-10 md:pt-14 md:scrollbar-hide">
          {/* Title */}
          <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white/95 sm:text-5xl md:text-[3.25rem]">
            {movie.title}
          </h1>

          {movie.tagline && (
            <p className="mt-2 text-sm font-medium text-white/50">
              {movie.tagline}
            </p>
          )}

          {/* Facts row: Year · Runtime · Rating */}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-base font-medium text-white/90">
            {releaseYear && <span>{releaseYear}</span>}
            {runtime && <span>{runtime}</span>}
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#f5c518] px-1.5 py-0.5 text-xs font-extrabold tracking-tight text-black">
                TMDB
              </span>
              <span className="flex items-center gap-1 font-semibold">
                {movie.vote_average.toFixed(1)}
                <Star size={13} className="fill-[#f5c518] text-[#f5c518]" />
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 max-w-2xl">
            <p
              className={cn(
                'text-[0.95rem] leading-relaxed text-white/75',
                !isOverviewExpanded && 'line-clamp-4',
              )}
            >
              {movie.overview}
            </p>
            {movie.overview.length > 220 && (
              <button
                type="button"
                onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                className="mt-2 text-xs font-bold uppercase tracking-wider text-[hsl(258,80%,60%)] hover:underline"
              >
                {isOverviewExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Genres & Cast Links (Stremio Links) */}
          <div className="mt-7 space-y-3">
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Genres
                </span>
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full bg-white/[0.06] px-3.5 py-1 text-xs font-medium text-white/80"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {topCast.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Cast
                </span>
                {topCast.map((actor) => (
                  <span
                    key={actor.id}
                    className="rounded-full bg-white/[0.06] px-3.5 py-1 text-xs font-medium text-white/80"
                  >
                    {actor.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Spacer pushes Actions to bottom on desktop */}
          <div className="min-h-[2rem] flex-1" />

          {/* Actions Row (Trailer + Share Pills) */}
          {(trailer || true) && (
            <div className="mt-6 flex flex-wrap items-center gap-3.5">
              {trailer && (
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="flex h-14 items-center gap-2.5 rounded-full bg-white/[0.06] px-6 text-[0.9375rem] font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/[0.12]"
                >
                  <Film size={19} />
                  <span>Trailer</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleShare}
                aria-label="Share"
                title="Share"
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white/[0.06] text-white/90 backdrop-blur-sm transition-colors hover:bg-white/[0.12]"
              >
                <Share2 size={19} />
              </button>
            </div>
          )}
        </div>

        {/* ── Right Floating Panel (Stremio Streams / Cast / Similar) ── */}
        <aside className="mt-8 flex flex-col overflow-hidden rounded-3xl bg-[rgba(12,11,17,0.68)] backdrop-blur-md md:ml-auto md:mt-0 md:w-[27.5rem] md:shrink-0">
          {/* Panel Header Tabs */}
          <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 pt-4 pb-3">
            {(
              [
                { id: 'streams', label: `Streams (${STREAM_SOURCES.length})` },
                { id: 'cast', label: 'Cast' },
                { id: 'similar', label: 'Similar' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-xs font-semibold transition-colors',
                  activeTab === tab.id
                    ? 'bg-white/[0.12] text-white'
                    : 'text-white/50 hover:bg-white/[0.05] hover:text-white/80',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Panel Body */}
          <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
            {activeTab === 'streams' && (
              <div className="space-y-1.5">
                {STREAM_SOURCES.map((source, index) => (
                  <button
                    key={source.id}
                    type="button"
                    onClick={() =>
                      navigate(`/watch/movie/${movie.id}?autoplay=true&source=${source.id}`)
                    }
                    className={cn(
                      'group grid w-full grid-cols-[1fr_auto] items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-colors duration-150 hover:bg-white/[0.06]',
                      index === 0 && 'bg-white/[0.04]',
                    )}
                  >
                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="truncate text-[0.9375rem] font-semibold text-white/95">
                          {source.name}
                        </span>
                        <span className="rounded bg-[#f6c700] px-1.5 py-0.5 text-[0.65rem] font-extrabold uppercase tracking-wider text-black">
                          HD
                        </span>
                      </div>
                      <p className="truncate text-xs text-white/50">
                        {index === 0 ? 'Recommended stream' : 'Fallback stream'} ·{' '}
                        {movie.title}
                      </p>
                    </div>

                    <span
                      className={cn(
                        'flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150',
                        index === 0
                          ? 'bg-[#22b365] text-white'
                          : 'bg-white/[0.06] text-white/80 group-hover:bg-[#22b365] group-hover:text-white',
                      )}
                    >
                      <Play size={16} fill="currentColor" className="ml-0.5" />
                    </span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'cast' && (
              <div className="space-y-1.5">
                {credits?.cast?.slice(0, 15).map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3.5 rounded-xl px-3 py-2.5 hover:bg-white/[0.04]"
                  >
                    <img
                      src={getImageUrl(member.profile_path, 'w185')}
                      alt={member.name}
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-full bg-white/[0.05] object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white/90">
                        {member.name}
                      </p>
                      <p className="truncate text-xs text-white/50">
                        {member.character}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'similar' && (
              <div className="grid grid-cols-3 gap-3 p-1">
                {similarMovies.map((item) => (
                  <Link
                    key={item.id}
                    to={`/movie/${item.id}`}
                    className="group block"
                  >
                    <div className="aspect-[2/3] overflow-hidden rounded-xl bg-white/[0.05]">
                      <img
                        src={getImageUrl(item.poster_path, 'w342')}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <p className="mt-1.5 line-clamp-2 text-center text-xs font-medium text-white/80 group-hover:text-white">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ───── Trailer Modal ───── */}
      {trailerOpen && trailer && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setTrailerOpen(false)}
              aria-label="Close trailer"
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
            >
              <X size={20} />
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
              title={`${movie.title} trailer`}
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
