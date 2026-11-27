import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Clapperboard, Tv } from 'lucide-react';
import { getAnimeMovies, getAnimeTVShows } from '@/services/tmdb';
import ContentGrid from '@/components/ContentGrid';
import Pagination from '@/components/Pagination';
import PageHeader from '@/components/layout/PageHeader';
import { cn } from '@/lib/utils';

type AnimeTab = 'tv' | 'movies';

const tabs: { id: AnimeTab; label: string; icon: typeof Tv }[] = [
  { id: 'tv', label: 'Anime Series', icon: Tv },
  { id: 'movies', label: 'Anime Movies', icon: Clapperboard },
];

const Anime = () => {
  const [tab, setTab] = useState<AnimeTab>('tv');
  const [page, setPage] = useState(1);

  const { data: animeTVData, isLoading: tvLoading } = useQuery({
    queryKey: ['animeTV', page],
    queryFn: () => getAnimeTVShows(page),
    enabled: tab === 'tv',
  });

  const { data: animeMoviesData, isLoading: moviesLoading } = useQuery({
    queryKey: ['animeMovies', page],
    queryFn: () => getAnimeMovies(page),
    enabled: tab === 'movies',
  });

  const handleTabChange = (newTab: AnimeTab) => {
    setTab(newTab);
    setPage(1);
  };

  const currentData = tab === 'tv' ? animeTVData : animeMoviesData;
  const isLoading = tab === 'tv' ? tvLoading : moviesLoading;

  return (
    <main className="px-4 pb-24 pt-28 md:px-12 md:pt-32">
      <PageHeader
        eyebrow="Library"
        title="Anime"
        description="Explore the best Japanese animation, from ongoing series to feature films."
      />

      <div className="mb-8 inline-flex rounded-2xl border border-white/10 bg-white/[0.04] p-1">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = tab === id;

          return (
            <button
              key={id}
              onClick={() => handleTabChange(id)}
              className={cn(
                'relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-200 md:px-5',
                isActive ? 'text-white' : 'text-white/50 hover:text-white'
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="anime-tab"
                  transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  className="brand-gradient absolute inset-0 rounded-xl"
                />
              )}
              <Icon size={16} className="relative" />
              <span className="relative">{label}</span>
            </button>
          );
        })}
      </div>

      <ContentGrid
        items={currentData?.results || []}
        type={tab === 'tv' ? 'tv' : 'movie'}
        isLoading={isLoading}
      />

      {currentData && (
        <Pagination
          page={page}
          totalPages={currentData.total_pages}
          onChange={setPage}
        />
      )}
    </main>
  );
};

export default Anime;
