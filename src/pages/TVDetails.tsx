import { Star, Clock, Calendar, Play, Plus, Heart, Share2, List, Download, Eye, Globe, Volume2, VolumeX, Tv } from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getTVShowDetails, getTVShowVideos, getTVShowCredits, getSimilarTVShows, getBackdropUrl, getImageUrl } from '@/services/tmdb';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import CastSection from '@/components/CastSection';
import MovieRow from '@/components/MovieRow';
import { DetailsSkeleton } from '@/components/ContentSkeletons';
import { Button } from '@/components/ui/button';

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
  const [isMuted, setIsMuted] = useState(false);

  const trailer = videos?.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') || videos?.results[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <DetailsSkeleton />
      </div>
    );
  }

  if (!show) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center h-[50vh]">
          <p className="text-muted-foreground text-xl">TV Show not found</p>
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
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Banner with Auto-playing Trailer */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        {trailer ? (
          <div className="absolute inset-0 pointer-events-none scale-150">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailer.key}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&vq=hd1080`}
              className="w-full h-full object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            {/* Volume Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-32 right-12 z-50 p-3 bg-black/40 hover:bg-black/60 rounded-full border border-white/10 backdrop-blur-sm transition-all pointer-events-auto"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
        ) : backdropUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backdropUrl})` }}
          />
        ) : null}

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

        {/* Main Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 md:px-12 pt-20">
          <div className="max-w-3xl space-y-6">
            {/* Genres Dot Separated */}
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              {show.genres.map((genre, index) => (
                <span key={genre.id} className="flex items-center">
                  {genre.name}
                  {index < show.genres.length - 1 && (
                    <span className="mx-2 h-1 w-1 rounded-full bg-gray-500" />
                  )}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
              {show.name}
            </h1>

            {/* Description with Read More */}
            <div className="space-y-2">
              <p className={`text-lg text-gray-200 leading-relaxed max-w-2xl ${!isOverviewExpanded && 'line-clamp-3'}`}>
                {show.overview}
              </p>
              {show.overview.length > 200 && (
                <button
                  onClick={() => setIsOverviewExpanded(!isOverviewExpanded)}
                  className="text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-bold uppercase transition-colors"
                >
                  {isOverviewExpanded ? 'Read Less' : 'Read More'}
                </button>
              )}
            </div>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-gray-300">
              <div className="flex items-center gap-1.5">
                <Eye size={18} />
                <span>{Math.floor(show.popularity * 100).toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Tv size={18} />
                <span>{show.number_of_seasons} Seasons</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-white">
                <span>{formattedDate}</span>
              </div>
              <div className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded uppercase tracking-wider">
                {show.status}
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Globe size={16} />
              <span>
                {show.spoken_languages && show.spoken_languages.length > 0
                  ? show.spoken_languages.map(l => l.name).join(', ')
                  : 'English'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => {
                  const url = `/watch/tv/${show.id}${continueSeason ? `?s=${continueSeason}&e=${continueEpisode}&autoplay=true` : '?autoplay=true'}`;
                  navigate(url);
                }}
                className="flex items-center gap-2 bg-[#E50914] hover:bg-[#B20710] text-white px-8 py-3 rounded font-bold transition-all transform hover:scale-105"
              >
                <Play size={20} fill="white" />
                {continueSeason ? `Continue S${continueSeason} E${continueEpisode}` : 'Start Watching'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the Content */}
      <div className="px-4 md:px-12 py-12 bg-black">
        {/* Poster and Secondary Info (Optional) */}
        <div className="hidden lg:flex gap-12 mb-16 border-t border-white/5 pt-12">
          <div className="flex-shrink-0 w-[240px]">
            <img
              src={getImageUrl(show.poster_path, 'w500')}
              alt={show.name}
              className="w-full rounded-xl shadow-2xl ring-1 ring-white/10"
            />
          </div>
          <div className="flex-1 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-gray-500 text-sm uppercase font-bold mb-2">Rating</h4>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  <span className="text-xl font-bold">{show.vote_average.toFixed(1)}</span>
                </div>
              </div>
              <div>
                <h4 className="text-gray-500 text-sm uppercase font-bold mb-2">Vote Count</h4>
                <span className="text-xl font-bold">{show.vote_count.toLocaleString()}</span>
              </div>
              <div>
                <h4 className="text-gray-500 text-sm uppercase font-bold mb-2">Tagline</h4>
                <p className="italic text-gray-300">{show.tagline || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-gray-500 text-sm uppercase font-bold mb-2">Episodes</h4>
                <span className="text-xl font-bold">{show.number_of_episodes} Total</span>
              </div>
            </div>
          </div>
        </div>

        {/* Seasons */}
        {show.seasons && show.seasons.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Tv className="text-primary" />
              Seasons
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {show.seasons.filter(s => s.season_number > 0).map((season) => (
                <div
                  key={season.id}
                  className="group bg-zinc-900/50 rounded-xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => navigate(`/watch/tv/${show.id}?s=${season.season_number}&e=1&autoplay=true`)}
                >
                  <div className="relative aspect-[2/3]">
                    <img
                      src={getImageUrl(season.poster_path, 'w300')}
                      alt={season.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-primary p-3 rounded-full">
                        <Play size={20} fill="white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{season.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{season.episode_count} Episodes</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cast */}
        {credits?.cast && <CastSection cast={credits.cast} />}

        {/* Similar TV Shows */}
        {similar?.results && similar.results.length > 0 && (
          <MovieRow
            title="Similar TV Shows"
            items={similar.results}
            type="tv"
            className="mt-12"
          />
        )}
      </div>

      <div className="pb-20" />
    </div>
  );
};

export default TVDetails;