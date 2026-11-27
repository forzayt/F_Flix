import { Movie, TVShow } from '@/services/tmdb';
import MovieCard from './MovieCard';
import { ContentGridSkeleton } from './ContentSkeletons';

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
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground text-lg">No content found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {items.map((item) => (
        <MovieCard key={item.id} item={item} type={type} className="w-full" />
      ))}
    </div>
  );
};

export default ContentGrid;