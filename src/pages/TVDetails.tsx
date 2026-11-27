import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Eye,
  Globe,
  Play,
  Star,
  Tv,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  getTVShowDetails,
  getTVShowVideos,
  getTVShowCredits,
  getSimilarTVShows,
  getBackdropUrl,
  getImageUrl,
} from '@/services/tmdb';
import CastSection from '@/components/CastSection';
import MovieRow from '@/components/MovieRow';
import { DetailsSkeleton } from '@/components/ContentSkeletons';
import { easeOutExpo, staggerContainer, staggerItem } from '@/lib/motion';

const TVDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tvId = Number(id);

  const continueSeason = Number(searchParams.get('s')) || null;
  const continueEpisode = Number(searchParams.get('e')) || null;

  const { data: show, isLoading } = useQuery({
    queryKey: ['tvshow', tvId],
    queryFn: () => getTVShowDetails(tvId),
    enabled: !!tvId,
  });

  const { data: videos } = useQuery({
    queryKey: ['tvVideos', tvId],
    queryFn: () => getTVShowVideos(tvId),
    enabled: !!tvId,
  });

  const { data: credits } = useQuery({
    queryKey: ['tvCredits', tvId],
    queryFn: () => getTVShowCredits(tvId),
    enabled: !!tvId,
  });

  const { data: similar } = useQuery({
    queryKey: ['similarTV', tvId],
    queryFn: () => getSimilarTVShows(tvId),
    enabled: !!tvId,
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

  if (!show) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <div className="glass rounded-3xl px-8 py-10 text-center">
          <p className="text-xl font-semibold text-white">TV show not found</p>
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

  const backdropUrl = getBackdropUrl(show.backdrop_path, 'original');
  const releaseDate = show.first_air_date ? new Date(show.first_air_date) : null;
  const year = releaseDate ? releaseDate.getFullYear() : 'N/A';
  const formattedDate = releaseDate
    ? releaseDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
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
              title={`${show.name} trailer`}
              tabIndex={-1}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[100vh] w-[177.78vh] min-h-full min-w-full -translate-x-1/2 -translate-y-1/2 border-0"
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
            alt={show.name}
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
                {show.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/60 backdrop-blur-md"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <h1 className="font-display text-4xl font-extrabold uppercase leading-[0.95] tracking-tight text-white text-shadow sm:text-5xl md:text-7xl">
                {show.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/65">
                <span className="flex items-center gap-1.5">
                  <Star size={15} className="fill-amber-400 text-amber-400" />
                  <span className="text-white">{show.vote_average.toFixed(1)}</span>
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span>{formattedDate}</span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1.5">
                  <Tv size={15} />
                  {show.number_of_seasons} Season{show.number_of_seasons === 1 ? '' : 's'}
                </span>
                <span className="h-1 w-1 rounded-full bg-white/30" />
                <span className="flex items-center gap-1.5">
                  <Eye size={15} />
                  {Math.floor(show.popularity * 100).toLocaleString()}
                </span>
              </div>

              <div className="space-y-2">
                <p
                  className={`max-w-2xl text-sm leading-relaxed text-white/70 md:text-base ${
                    !isOverviewExpanded && 'line-clamp-3'
                  }`}
                >
                  {show.overview}
                </p>
                {show.overview.length > 200 && (
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
                  onClick={() => {
                    const url = `/watch/tv/${show.id}${
                      continueSeason
                        ? `?s=${continueSeason}&e=${continueEpisode}&autoplay=true`
                        : '?autoplay=true'
                    }`;
                    navigate(url);
                  }}
                  className="brand-gradient glow-primary inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <Play size={17} fill="currentColor" />
                  {continueSeason
                    ? `Continue S${continueSeason} E${continueEpisode}`
                    : 'Start watching'}
                </button>

                <div className="glass flex items-center gap-2 rounded-2xl px-4 py-3 text-xs text-white/55">
                  <Globe size={15} />
                  {show.spoken_languages && show.spoken_languages.length > 0
                    ? show.spoken_languages.map((l) => l.name).join(', ')
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
            { label: 'Rating', value: show.vote_average.toFixed(1) },
            { label: 'Votes', value: show.vote_count.toLocaleString() },
            { label: 'Status', value: show.status },
            { label: 'Episodes', value: `${show.number_of_episodes} total` },
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

        {show.seasons && show.seasons.length > 0 && (
          <section className="mt-12">
            <div className="mb-5 flex items-center gap-3">
              <span className="brand-gradient h-5 w-1 rounded-full" />
              <h2 className="font-display text-xl font-bold text-white md:text-2xl">Seasons</h2>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-6"
            >
              {show.seasons
                .filter((season) => season.season_number > 0)
                .map((season) => (
                  <motion.button
                    key={season.id}
                    variants={staggerItem}
                    whileHover={{ y: -6 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                    onClick={() =>
                      navigate(
                        `/watch/tv/${show.id}?s=${season.season_number}&e=1&autoplay=true`
                      )
                    }
                    className="group overflow-hidden rounded-2xl border border-white/10 bg-secondary text-left shadow-[0_18px_45px_-28px_rgba(0,0,0,0.95)]"
                  >
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <img
                        src={getImageUrl(season.poster_path, 'w300')}
                        alt={season.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="brand-gradient glow-primary flex h-11 w-11 items-center justify-center rounded-full text-white">
                          <Play size={17} fill="currentColor" className="ml-0.5" />
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-1 text-sm font-semibold text-white/90 transition-colors group-hover:text-white">
                        {season.name}
                      </p>
                      <p className="mt-1 text-xs text-white/40">
                        {season.episode_count} Episodes
                      </p>
                    </div>
                  </motion.button>
                ))}
            </motion.div>
          </section>
        )}

        {credits?.cast && <CastSection cast={credits.cast} />}

        {similar?.results && similar.results.length > 0 && (
          <MovieRow
            title="Similar TV Shows"
            items={similar.results}
            type="tv"
            className="mt-10"
          />
        )}
      </div>
    </div>
  );
};

export default TVDetails;
