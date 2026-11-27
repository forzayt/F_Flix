import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search as SearchIcon, SearchX } from 'lucide-react';
import { searchMulti, Movie, TVShow } from '@/services/tmdb';
import MovieCard from '@/components/MovieCard';
import { ContentGridSkeleton } from '@/components/ContentSkeletons';
import PageHeader from '@/components/layout/PageHeader';
import { staggerContainer } from '@/lib/motion';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputValue, setInputValue] = useState(query);

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => searchMulti(query),
    enabled: query.length > 0,
  });

  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue.trim() !== query) {
        setSearchParams({ q: inputValue.trim() }, { replace: true });
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [inputValue, query, setSearchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
    <main className="px-4 pb-24 pt-28 md:px-12 md:pt-32">
      <PageHeader
        eyebrow="Discover"
        title="Search"
        description="Find movies, TV series and anime across the entire catalogue."
      />

      <form onSubmit={handleSearch} className="mb-10 max-w-2xl">
        <div className="group relative">
          <SearchIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-primary" size={20} />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search movies, TV shows, anime..."
            aria-label="Search catalogue"
            className="glass w-full rounded-2xl py-4 pl-12 pr-4 text-base text-white placeholder:text-white/35 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </div>
      </form>

      {query ? (
        <>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-white md:text-xl">
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
              className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6"
            >
              {filteredResults.map((item) => (
                <MovieCard
                  key={item.id}
                  item={item}
                  type={getMediaType(item)}
                  className="w-full"
                />
              ))}
            </motion.div>
          ) : (
            <div className="glass flex flex-col items-center justify-center gap-3 rounded-3xl px-6 py-20 text-center">
              <div className="brand-gradient-soft flex h-14 w-14 items-center justify-center rounded-2xl text-primary">
                <SearchX size={24} />
              </div>
              <p className="text-lg font-medium text-white/80">
                No results for “{query}”
              </p>
              <p className="text-sm text-white/40">Try a different title or keyword.</p>
            </div>
          )}
        </>
      ) : (
        <div className="glass flex flex-col items-center justify-center gap-3 rounded-3xl px-6 py-20 text-center">
          <div className="brand-gradient-soft flex h-14 w-14 items-center justify-center rounded-2xl text-primary">
            <SearchIcon size={24} />
          </div>
          <p className="text-lg font-medium text-white/80">Start typing to search</p>
          <p className="text-sm text-white/40">
            Press <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px]">Ctrl K</kbd> anywhere to focus search.
          </p>
        </div>
      )}
    </main>
  );
};

export default Search;
