import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Star } from 'lucide-react';
import { getImageUrl, Movie, TVShow } from '@/services/tmdb';
import { cn } from '@/lib/utils';
import { staggerItem } from '@/lib/motion';

interface MovieCardProps {
  item: Movie | TVShow;
  type: 'movie' | 'tv';
  className?: string;
}

const MovieCard = ({ item, type, className }: MovieCardProps) => {
  const title = 'title' in item ? item.title : item.name;
  const date = 'release_date' in item ? item.release_date : item.first_air_date;
  const year = date ? new Date(date).getFullYear() : 'N/A';

  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 320, damping: 26 }}
      className={cn('group/card relative w-[150px] shrink-0', className)}
    >
      <Link
        to={`/${type}/${item.id}`}
        className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <div className="relative aspect-[2/3] overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-[0_18px_45px_-25px_rgba(0,0,0,0.95)]">
          <img
            src={getImageUrl(item.poster_path, 'w500')}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/card:scale-110"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-70 transition-opacity duration-300 group-hover/card:opacity-100" />

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover/card:opacity-100">
            <span className="brand-gradient glow-primary flex h-12 w-12 scale-75 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover/card:scale-100">
              <Play size={18} fill="currentColor" className="ml-0.5" />
            </span>
          </div>

          {/* Rating */}
          <div className="absolute right-2 top-2 flex items-center gap-1 rounded-lg border border-white/10 bg-black/55 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
            <Star size={11} className="fill-amber-400 text-amber-400" />
            {item.vote_average.toFixed(1)}
          </div>

          {/* Progress hint */}
          <div className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
            <span className="brand-gradient block h-full w-0 transition-all duration-500 group-hover/card:w-1/3" />
          </div>
        </div>

        <div className="mt-3 space-y-1 px-0.5">
          <h3 className="line-clamp-2 text-sm font-medium text-white/90 transition-colors group-hover/card:text-white">
            {title}
          </h3>
          <p className="text-xs text-white/40">{year}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
