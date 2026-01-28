import { Star, Clock, Calendar, Play, Plus, Heart, Share2, List, Download, Eye, Globe, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMovieDetails, getMovieVideos, getMovieCredits, getSimilarMovies, getBackdropUrl, getImageUrl } from '@/services/tmdb';
import Navbar from '@/components/Navbar';
import VideoPlayer from '@/components/VideoPlayer';
import CastSection from '@/components/CastSection';
import MovieRow from '@/components/MovieRow';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';


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
  const [isMuted, setIsMuted] = useState(false);

  const trailer = videos?.results.find((v) => v.type === 'Trailer' && v.site === 'YouTube') || videos?.results[0];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20">
          <Skeleton className="h-[60vh] w-full" />
          <div className="px-4 md:px-12 py-8 space-y-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-20 flex items-center justify-center h-[50vh]">
          <p className="text-muted-foreground text-xl">Movie not found</p>
        </div>
      </div>
    );
  }

  const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');
  const releaseDate = movie.release_date ? new Date(movie.release_date) : null;
  const formattedDate = releaseDate
    ? releaseDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'N/A';
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Banner with Auto-playing Trailer */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        {trailer ? (
          <div className="absolute inset-0 pointer-events-none scale-150">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${trailer.key}&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1`}
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
              {movie.genres.map((genre, index) => (
                <span key={genre.id} className="flex items-center">
                  {genre.name}
                  {index < movie.genres.length - 1 && (
                    <span className="mx-2 h-1 w-1 rounded-full bg-gray-500" />
                  )}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">
              {movie.title}
            </h1>

            {/* Description with Read More */}
            <div className="space-y-2">
              <p className={`text-lg text-gray-200 leading-relaxed max-w-2xl ${!isOverviewExpanded && 'line-clamp-3'}`}>
                {movie.overview}
              </p>
              {movie.overview.length > 200 && (
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
                <span>{Math.floor(movie.popularity * 100).toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={18} />
                <span>{runtime}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-white">
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Language */}
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Globe size={16} />
              <span>
                {movie.spoken_languages && movie.spoken_languages.length > 0
                  ? movie.spoken_languages.map(l => l.name).join(', ')
                  : 'English'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => navigate(`/watch/movie/${movie.id}?autoplay=true`)}
                className="flex items-center gap-2 bg-[#E50914] hover:bg-[#B20710] text-white px-8 py-3 rounded font-bold transition-all transform hover:scale-105"
              >
                <Play size={20} fill="white" />
                Start Watching
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
              src={getImageUrl(movie.poster_path, 'w500')}
              alt={movie.title}
              className="w-full rounded-xl shadow-2xl ring-1 ring-white/10"
            />
          </div>
          <div className="flex-1 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h4 className="text-gray-500 text-sm uppercase font-bold mb-2">Rating</h4>
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-500 fill-yellow-500" size={20} />
                  <span className="text-xl font-bold">{movie.vote_average.toFixed(1)}</span>
                </div>
              </div>
              <div>
                <h4 className="text-gray-500 text-sm uppercase font-bold mb-2">Vote Count</h4>
                <span className="text-xl font-bold">{movie.vote_count.toLocaleString()}</span>
              </div>
              <div>
                <h4 className="text-gray-500 text-sm uppercase font-bold mb-2">Tagline</h4>
                <p className="italic text-gray-300">{movie.tagline || 'N/A'}</p>
              </div>
              <div>
                <h4 className="text-gray-500 text-sm uppercase font-bold mb-2">Status</h4>
                <span className="text-xl font-bold">{movie.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cast */}
        {credits?.cast && <CastSection cast={credits.cast} />}

        {/* Similar Movies */}
        {similar?.results && similar.results.length > 0 && (
          <MovieRow
            title="Similar Movies"
            items={similar.results}
            type="movie"
            className="mt-12"
          />
        )}
      </div>

      <div className="pb-20" />
    </div>
  );
};

export default MovieDetails;