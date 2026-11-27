import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clapperboard, Film, SearchX, Sparkles, Tv } from 'lucide-react';
import { searchMulti, Movie, TVShow } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { ContentGridSkeleton } from '@/components/ContentSkeletons';
import { staggerContainer } from '@/lib/motion';

const searchHints = [
  { icon: Film, label: 'Movies & Trailers' },
  { icon: Tv, label: 'TV Series & Episodes' },
  { icon: Sparkles, label: 'Anime & Animation' },
  { icon: Clapperboard, label: 'Actors & Genres' },
];

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchMulti(query),
    enabled: query.length > 0,
  });

  const getMediaType = (item: Movie | TVShow): 'movie' | 'tv' => {
    if ('media_type' in item) {
      return item.media_type === 'tv' ? 'tv' : 'movie';
    }
    return 'title' in item ? 'movie' : 'tv';
  };

  const filteredResults =
    data?.results.filter(
      (item) =>
        item.media_type !== 'person' &&
        (item.poster_path || item.backdrop_path)
    ) || [];

  return (
    <div className="min-h-screen px-4 pb-24 pt-[6.5rem] md:px-10 md:pt-[6.5rem]">
      {!query ? (
        /* ── Stremio-style Search Hints empty state ── */
        <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 0.4, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-center text-2xl font-normal text-white"
          >
            Search anything...
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mt-14 grid w-full max-w-3xl grid-cols-2 gap-10 px-4 sm:grid-cols-4"
          >
            {searchHints.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center text-center opacity-40"
              >
                <Icon className="mb-5 h-14 w-14 text-white" strokeWidth={1.35} />
                <span className="text-base font-normal text-white">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-xl font-medium text-white/90 md:text-2xl">
              {isLoading ? 'Searching…' : `Results for “${query}”`}
            </h2>
            {!isLoading && (
              <span className="text-xs text-white/40">
                {filteredResults.length} result{filteredResults.length === 1 ? '' : 's'}
              </span>
            )}
          </div>

          {isLoading ? (
            <ContentGridSkeleton count={12} />
          ) : filteredResults.length > 0 ? (
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              className="grid grid-cols-[repeat(auto-fill,120px)] justify-between gap-4 sm:grid-cols-[repeat(auto-fill,135px)] md:grid-cols-[repeat(auto-fill,145px)] md:gap-5"
            >
              {filteredResults.map((item) => (
                <MovieCard
                  key={item.id}
                  item={item}
                  type={getMediaType(item)}
                />
              ))}
            </motion.div>
          ) : (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center opacity-60">
              <SearchX size={48} strokeWidth={1.4} className="text-white" />
              <p className="text-xl font-medium text-white">
                No results for “{query}”
              </p>
              <p className="text-sm text-white/60">Try a different title or keyword.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Search;
