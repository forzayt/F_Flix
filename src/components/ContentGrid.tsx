import { motion } from 'framer-motion';
import { Film } from 'lucide-react';
import { Movie, TVShow } from '@/services/tmdb';
import MovieCard from './MovieCard';
import { ContentGridSkeleton } from './ContentSkeletons';
import { staggerContainer } from '@/lib/motion';

interface ContentGridProps {
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
  isLoading?: boolean;
}

const ContentGrid = ({ items, type, isLoading }: ContentGridProps) => {
  if (isLoading) {
    return <ContentGridSkeleton count={18} />;
  }

  if (!items.length) {
    return (
      <div className="glass flex flex-col items-center justify-center gap-3 rounded-3xl px-6 py-20 text-center">
        <div className="brand-gradient-soft flex h-14 w-14 items-center justify-center rounded-2xl text-primary">
          <Film size={24} />
        </div>
        <p className="text-lg font-medium text-white/80">No content found</p>
        <p className="text-sm text-white/40">Try a different genre or page.</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 md:gap-6 lg:grid-cols-5 xl:grid-cols-6"
    >
      {items.map((item) => (
        <MovieCard key={item.id} item={item} type={type} className="w-full" />
      ))}
    </motion.div>
  );
};

export default ContentGrid;
