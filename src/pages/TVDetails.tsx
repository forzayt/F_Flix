import { useState, useMemo } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  ChevronLeft,
  Film,
  Play,
  Search,
  Share2,
  Star,
  Tv,
  X,
} from 'lucide-react';
import {
  getTVShowDetails,
  getTVSeasonDetails,
  getTVShowVideos,
  getTVShowCredits,
  getSimilarTVShows,
  getBackdropUrl,
  getImageUrl,
  Episode,
} from '@/services/tmdb';
import { STREAM_SOURCES } from '@/constants/sources';
import { DetailsSkeleton } from '@/components/ContentSkeletons';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type PanelTab = 'episodes' | 'cast' | 'similar';

const TVDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tvId = Number(id);

  const initialSeason = Number(searchParams.get('s')) || 1;
  const [selectedSeason, setSelectedSeason] = useState<number>(initialSeason);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [episodeSearch, setEpisodeSearch] = useState('');
  const [activeTab, setActiveTab] = useState<PanelTab>('episodes');
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);

  const { data: show, isLoading } = useQuery({
    queryKey: ['tvshow', tvId],
    queryFn: () => getTVShowDetails(tvId),
    enabled: !!tvId,
  });

  const { data: seasonData, isLoading: seasonLoading } = useQuery({
    queryKey: ['tvSeason', tvId, selectedSeason],
    queryFn: () => getTVSeasonDetails(tvId, selectedSeason),
    enabled: !!tvId && selectedSeason > 0,
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

  const trailer =
    videos?.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') ||
    videos?.results[0];

  const seasons = useMemo(
    () => (show?.seasons || []).filter((s) => s.season_number > 0),
    [show?.seasons],
  );

  const filteredEpisodes = useMemo(() => {
    const episodes = seasonData?.episodes || [];
    const q = episodeSearch.trim().toLowerCase();
    if (!q) return episodes;
    return episodes.filter(
      (ep) =>
        ep.name.toLowerCase().includes(q) ||
        String(ep.episode_number).includes(q) ||
        ep.overview.toLowerCase().includes(q),
    );
  }, [seasonData?.episodes, episodeSearch]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black">
        <DetailsSkeleton />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-4">
        <div className="rounded-3xl bg-white/[0.05] px-8 py-10 text-center">
          <p className="text-xl font-semibold text-white">TV show not found</p>
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

  const backdropUrl = getBackdropUrl(show.backdrop_path, 'original');
  const releaseYear = show.first_air_date
    ? new Date(show.first_air_date).getFullYear()
    : null;
  const topCast = credits?.cast?.slice(0, 6) || [];
  const similarShows = similar?.results?.slice(0, 12) || [];

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const handleSeasonChange = (value: string) => {
    setSelectedSeason(Number(value));
    setSelectedEpisode(null);
    setEpisodeSearch('');
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-black text-white/90 md:h-screen md:overflow-hidden">
      {/* ───── Stremio Background + Scrim ───── */}
      {backdropUrl && (
        <div className="pointer-events-none fixed inset-0 z-0">
          <img
            src={backdropUrl}
            alt={show.name}
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
            {show.name}
          </h1>

          {/* Facts row: Year · Seasons · Rating */}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 text-base font-medium text-white/90">
            {releaseYear && <span>{releaseYear}</span>}
            <span>
              {show.number_of_seasons} Season
              {show.number_of_seasons === 1 ? '' : 's'}
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded bg-[#f5c518] px-1.5 py-0.5 text-xs font-extrabold tracking-tight text-black">
                TMDB
              </span>
              <span className="flex items-center gap-1 font-semibold">
                {show.vote_average.toFixed(1)}
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
              {show.overview}
            </p>
            {show.overview.length > 220 && (
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
            {show.genres.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-white/40">
                  Genres
                </span>
                {show.genres.map((genre) => (
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
        </div>

        {/* ── Right Floating Panel (Stremio Episodes / Streams / Cast / Similar) ── */}
        <aside className="mt-8 flex flex-col overflow-hidden rounded-3xl bg-[rgba(12,11,17,0.68)] backdrop-blur-md md:ml-auto md:mt-0 md:w-[27.5rem] md:shrink-0">
          {selectedEpisode ? (
            /* ── Streams view for the selected episode ── */
            <>
              <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-3.5">
                <button
                  type="button"
                  onClick={() => setSelectedEpisode(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] text-white/80 transition-colors hover:bg-white/[0.12] hover:text-white"
                  aria-label="Back to episodes"
                >
                  <ChevronLeft size={18} />
                </button>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-white/45">
                    Season {selectedSeason} · Episode {selectedEpisode.episode_number}
                  </p>
                  <p className="truncate text-sm font-semibold text-white/95">
                    {selectedEpisode.name}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
                <div className="space-y-1.5">
                  {STREAM_SOURCES.map((source, index) => (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/watch/tv/${show.id}?s=${selectedSeason}&e=${selectedEpisode.episode_number}&autoplay=true&source=${source.id}`,
                        )
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
                          S{selectedSeason}E{selectedEpisode.episode_number} ·{' '}
                          {selectedEpisode.name}
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
              </div>
            </>
          ) : (
            /* ── Default Tabs: Episodes (with Season dropdown) / Cast / Similar ── */
            <>
              <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-4 pb-3 pt-3.5">
                <div className="flex items-center gap-1.5">
                  {(
                    [
                      { id: 'episodes', label: 'Episodes' },
                      { id: 'cast', label: 'Cast' },
                      { id: 'similar', label: 'Similar' },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors',
                        activeTab === tab.id
                          ? 'bg-white/[0.12] text-white'
                          : 'text-white/50 hover:bg-white/[0.05] hover:text-white/80',
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === 'episodes' && seasons.length > 0 && (
                  <Select
                    value={String(selectedSeason)}
                    onValueChange={handleSeasonChange}
                  >
                    <SelectTrigger className="h-9 w-[8.5rem] rounded-xl border-white/10 bg-white/[0.06] text-xs font-semibold text-white focus:ring-0">
                      <SelectValue placeholder="Season" />
                    </SelectTrigger>
                    <SelectContent className="border-white/10 bg-[#0c0b11] text-white">
                      {seasons.map((s) => (
                        <SelectItem
                          key={s.id}
                          value={String(s.season_number)}
                          className="text-xs focus:bg-white/10 focus:text-white"
                        >
                          Season {s.season_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Search episodes input */}
              {activeTab === 'episodes' && (
                <div className="px-3.5 pt-3">
                  <div className="relative flex items-center rounded-xl bg-white/[0.05]">
                    <Search
                      size={15}
                      className="pointer-events-none ml-3 text-white/40"
                    />
                    <input
                      type="text"
                      value={episodeSearch}
                      onChange={(e) => setEpisodeSearch(e.target.value)}
                      placeholder="Search episodes..."
                      className="h-9 w-full bg-transparent px-2.5 text-xs text-white/90 placeholder:text-white/40 focus:outline-none"
                    />
                    {episodeSearch && (
                      <button
                        type="button"
                        onClick={() => setEpisodeSearch('')}
                        className="pr-2.5 text-white/40 hover:text-white"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Panel Body */}
              <div className="flex-1 overflow-y-auto p-3 scrollbar-hide">
                {activeTab === 'episodes' && (
                  <div className="space-y-1">
                    {seasonLoading ? (
                      Array.from({ length: 6 }).map((_, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-[8.5rem_1fr] items-center gap-3.5 rounded-xl p-2"
                        >
                          <div className="aspect-video animate-pulse rounded-md bg-white/[0.06]" />
                          <div className="space-y-2">
                            <div className="h-3.5 w-3/4 animate-pulse rounded bg-white/[0.06]" />
                            <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.04]" />
                          </div>
                        </div>
                      ))
                    ) : filteredEpisodes.length > 0 ? (
                      filteredEpisodes.map((ep) => (
                        <button
                          key={ep.id}
                          type="button"
                          onClick={() => setSelectedEpisode(ep)}
                          className="group grid w-full grid-cols-[8.5rem_minmax(0,1fr)] items-center gap-3.5 rounded-xl p-2 text-left transition-colors duration-150 hover:bg-white/[0.06]"
                        >
                          <div className="relative aspect-video overflow-hidden rounded-md bg-white/[0.05]">
                            {ep.still_path ? (
                              <img
                                src={getImageUrl(ep.still_path, 'w300')}
                                alt={ep.name}
                                loading="lazy"
                                className="h-full w-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-white/25">
                                <Tv size={22} />
                              </div>
                            )}
                            <span className="absolute bottom-1 left-1 rounded bg-black/75 px-1.5 py-0.5 text-[10px] font-bold text-white/90">
                              E{ep.episode_number}
                            </span>
                          </div>

                          <div className="min-w-0 space-y-1">
                            <p className="line-clamp-1 text-sm font-semibold text-white/95">
                              {ep.episode_number}. {ep.name}
                            </p>
                            <p className="text-[11px] text-white/45">
                              {ep.air_date
                                ? new Date(ep.air_date).toLocaleDateString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    },
                                  )
                                : 'TBA'}
                              {ep.runtime ? ` · ${ep.runtime}m` : ''}
                            </p>
                            {ep.overview && (
                              <p className="line-clamp-2 text-xs leading-snug text-white/55">
                                {ep.overview}
                              </p>
                            )}
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="py-12 text-center text-sm text-white/40">
                        No episodes found
                      </div>
                    )}
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
                    {similarShows.map((item) => (
                      <Link
                        key={item.id}
                        to={`/tv/${item.id}`}
                        className="group block"
                      >
                        <div className="aspect-[2/3] overflow-hidden rounded-xl bg-white/[0.05]">
                          <img
                            src={getImageUrl(item.poster_path, 'w342')}
                            alt={item.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-center text-xs font-medium text-white/80 group-hover:text-white">
                          {item.name}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
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
              title={`${show.name} trailer`}
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

export default TVDetails;
