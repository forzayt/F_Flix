import { motion } from 'framer-motion';
import { Genre } from '@/services/tmdb';
import { cn } from '@/lib/utils';

interface GenreFilterProps {
  genres: Genre[];
  selectedGenre: string | null;
  onSelectGenre: (genreId: string | null) => void;
}

const GenreFilter = ({ genres, selectedGenre, onSelectGenre }: GenreFilterProps) => {
  const options = [{ id: null as string | null, name: 'All' }, ...genres];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((genre) => {
        const isActive = selectedGenre === genre.id;

        return (
          <motion.button
            key={genre.id ?? 'all'}
            onClick={() => onSelectGenre(genre.id)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            className={cn(
              'relative overflow-hidden rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200',
              isActive
                ? 'border-transparent text-white'
                : 'border-white/10 bg-white/[0.04] text-white/55 hover:border-white/20 hover:bg-white/[0.08] hover:text-white'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="genre-active"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                className="brand-gradient absolute inset-0 rounded-full"
              />
            )}
            <span className="relative">{genre.name}</span>
          </motion.button>
        );
      })}
    </div>
  );
};

export default GenreFilter;
