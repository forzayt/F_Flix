import { useQuery } from '@tanstack/react-query';
import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getPopularTVShows,
  getIndianMovies,
  getImageUrl,
} from '@/services/tmdb';
import { useState, useEffect } from 'react';
import { Clock, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import MovieRow from '@/components/MovieRow';
import DraggableCarousel from '@/components/DraggableCarousel';
import { HeroSkeleton, MovieRowSkeleton } from '@/components/ContentSkeletons';
import {
  getContinueWatching,
  removeFromContinueWatching,
  ContinueWatchingItem,
} from '@/lib/continueWatching';
import { staggerContainer, staggerItem } from '@/lib/motion';

const Index = () => {
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);

  useEffect(() => {
    setContinueWatching(getContinueWatching());
  }, []);

  const handleRemove = (e: React.MouseEvent, id: number, type: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromContinueWatching(id, type);
    setContinueWatching(getContinueWatching());
  };

  const { data: trending, isLoading: trendingLoading } = useQuery({
    queryKey: ['trending'],
    queryFn: () => getTrending('all', 'week'),
  });

  const { data: popularMovies, isLoading: popularMoviesLoading } = useQuery({
    queryKey: ['popularMovies'],
    queryFn: () => getPopularMovies(),
  });

  const { data: topRatedMovies, isLoading: topRatedMoviesLoading } = useQuery({
    queryKey: ['topRatedMovies'],
    queryFn: () => getTopRatedMovies(),
  });

  const { data: popularTVShows, isLoading: popularTVShowsLoading } = useQuery({
    queryKey: ['popularTVShows'],
    queryFn: () => getPopularTVShows(),
  });

  const { data: indianMovies, isLoading: indianMoviesLoading } = useQuery({
    queryKey: ['indianMovies'],
    queryFn: () => getIndianMovies(),
  });

  const heroItems = trending?.results?.slice(0, 5) || [];

  return (
    <div className="min-h-screen">
      {/* Hero — bleeds under the left rail */}
      <div className="md:-ml-24">
        {trendingLoading ? (
          <HeroSkeleton />
        ) : heroItems.length > 0 ? (
          <HeroSection items={heroItems} />
        ) : null}
      </div>

      <div className="relative z-10 -mt-24 pb-24">
        {/* Continue Watching */}
        {continueWatching.length > 0 && (
          <motion.section
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="mb-8"
          >
            <div className="mb-4 flex items-center justify-between px-4 md:px-12">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-white md:text-2xl">
                <Clock size={20} className="text-primary" />
                Continue watching
              </h2>
              <span className="text-xs font-medium text-white/40">
                {continueWatching.length} title{continueWatching.length === 1 ? '' : 's'}
              </span>
            </div>

            <DraggableCarousel className="px-4 py-2 md:px-12" contentClassName="gap-4">
              {continueWatching.map((item) => (
                <motion.div
                  key={`${item.type}-${item.id}`}
                  variants={staggerItem}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className="group relative w-[260px] md:w-[320px]"
                >
                  <Link
                    to={`/${item.type === 'movie' ? 'movie' : 'tv'}/${item.id}${
                      item.type !== 'movie' ? `?s=${item.season}&e=${item.episode}` : ''
                    }`}
                    className="block overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-[0_18px_45px_-28px_rgba(0,0,0,0.95)] focus:outline-none"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={getImageUrl(item.backdrop_path || item.poster_path, 'w500')}
                        alt={item.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="line-clamp-1 text-sm font-semibold text-white md:text-base">
                          {item.title}
                        </h3>
                        {item.type !== 'movie' && (
                          <p className="mt-1 text-xs text-white/50">
                            Season {item.season} • Episode {item.episode}
                          </p>
                        )}
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="brand-gradient glow-primary flex h-12 w-12 items-center justify-center rounded-full text-white">
                          <Play size={20} fill="currentColor" className="ml-0.5" />
                        </span>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
                        <span className="brand-gradient block h-full w-1/3" />
                      </div>
                    </div>
                  </Link>

                  <button
                    onClick={(e) => handleRemove(e, item.id, item.type)}
                    title="Remove from history"
                    aria-label="Remove from history"
                    className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white opacity-0 backdrop-blur-md transition-all duration-200 hover:bg-destructive group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </DraggableCarousel>
          </motion.section>
        )}

        {popularMoviesLoading ? (
          <MovieRowSkeleton />
        ) : (
          popularMovies?.results && (
            <MovieRow
              title="Popular Movies"
              items={popularMovies.results}
              type="movie"
              seeAllTo="/movies"
            />
          )
        )}

        {topRatedMoviesLoading ? (
          <MovieRowSkeleton />
        ) : (
          topRatedMovies?.results && (
            <MovieRow
              title="Top Rated Movies"
              items={topRatedMovies.results}
              type="movie"
              seeAllTo="/movies"
            />
          )
        )}

        {popularTVShowsLoading ? (
          <MovieRowSkeleton />
        ) : (
          popularTVShows?.results && (
            <MovieRow
              title="Popular TV Shows"
              items={popularTVShows.results}
              type="tv"
              seeAllTo="/tv-series"
            />
          )
        )}

        {indianMoviesLoading ? (
          <MovieRowSkeleton />
        ) : (
          indianMovies?.results && (
            <MovieRow
              title="Popular in India"
              items={indianMovies.results}
              type="movie"
              seeAllTo="/movies"
            />
          )
        )}
      </div>
    </div>
  );
};

export default Index;
