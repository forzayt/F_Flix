import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, TVShow } from '@/services/tmdb';
import MovieCard from './MovieCard';
import DraggableCarousel, { type CarouselApi } from './DraggableCarousel';
import { cn } from '@/lib/utils';

interface MovieRowProps {
  title: string;
  items: (Movie | TVShow)[];
  type: 'movie' | 'tv';
  className?: string;
}

const MovieRow = ({ title, items, type, className }: MovieRowProps) => {
  const [api, setApi] = useState<CarouselApi | undefined>(undefined);

  if (!items.length) return null;

  return (
    <section className={cn('relative py-6', className)}>
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4 md:px-12">{title}</h2>

      <div className="group/row relative">
        {/* Left Arrow */}
        <button
          onClick={() => api?.scrollPrev()}
          disabled={!api?.canScrollPrev()}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover/row:opacity-100 focus:opacity-100 transition-opacity hover:bg-background focus:bg-background ml-2 outline-none focus:ring-2 focus:ring-primary disabled:opacity-30"
        >
          <ChevronLeft size={24} />
        </button>

        <DraggableCarousel
          setApi={setApi}
          className="px-4 md:px-12 py-4 -my-4"
          slideClassName="max-w-[130px] md:max-w-[210px]"
        >
          {items.map((item) => (
            <MovieCard
              key={item.id}
              item={item}
              type={type}
              className="w-[120px] md:w-[160px] group-hover/row:opacity-50 hover:!opacity-100 focus:!opacity-100 transition-opacity duration-300"
            />
          ))}
        </DraggableCarousel>

        {/* Right Arrow */}
        <button
          onClick={() => api?.scrollNext()}
          disabled={!api?.canScrollNext()}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover/row:opacity-100 focus:opacity-100 transition-opacity hover:bg-background focus:bg-background mr-2 outline-none focus:ring-2 focus:ring-primary disabled:opacity-30"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
};

export default MovieRow;