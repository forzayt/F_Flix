import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, TVShow } from '@/services/tmdb';
import MovieCard from './MovieCard';
import DraggableCarousel, { type CarouselApi } from './DraggableCarousel';
import { cn } from '@/lib/utils';
import { staggerContainer } from '@/lib/motion';

interface MovieRowProps {
  title: string;
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
  className?: string;
  seeAllTo?: string;
}

const MovieRow = ({ title, items, type, className, seeAllTo }: MovieRowProps) => {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!api) return;
    const update = () => {
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
    };
    update();
    api.on('select', update);
    api.on('reInit', update);
    return () => {
      api.off('select', update);
      api.off('reInit', update);
    };
  }, [api]);

  if (!items.length) return null;

  const seeAll = seeAllTo ?? (type === 'movie' ? '/movies' : '/tv-series');

  return (
    <motion.section
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      className={cn('relative py-5', className)}
    >
      <div className="mb-4 flex items-center justify-between px-4 md:px-12">
        <h2 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">
          {title}
        </h2>
        <Link
          to={seeAll}
          className="group flex items-center gap-1 text-xs font-medium text-white/45 transition-colors hover:text-white"
        >
          See all
          <ChevronRight
            size={14}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
      </div>

      <div className="group/row relative">
        <motion.button
          onClick={() => api?.scrollPrev()}
          disabled={!canPrev}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll left"
          className="glass absolute left-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/80 opacity-0 transition-opacity duration-300 hover:bg-white/10 hover:text-white disabled:opacity-0 group-hover/row:opacity-100 md:left-4 md:flex"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <DraggableCarousel
          setApi={setApi}
          className="px-4 py-3 md:px-12"
          slideClassName="max-w-[150px] md:max-w-[185px]"
        >
          {items.map((item) => (
            <MovieCard
              key={item.id}
              item={item}
              type={type}
              className="w-[125px] md:w-[165px]"
            />
          ))}
        </DraggableCarousel>

        <motion.button
          onClick={() => api?.scrollNext()}
          disabled={!canNext}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Scroll right"
          className="glass absolute right-2 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-white/80 opacity-0 transition-opacity duration-300 hover:bg-white/10 hover:text-white disabled:opacity-0 group-hover/row:opacity-100 md:right-4 md:flex"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>
    </motion.section>
  );
};

export default MovieRow;
