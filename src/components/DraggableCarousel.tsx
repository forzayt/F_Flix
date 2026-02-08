import { useEffect, type ReactNode } from 'react';
import React from 'react';
import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';
import { cn } from '@/lib/utils';

type CarouselApi = UseEmblaCarouselType[1];

interface DraggableCarouselProps {
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  slideClassName?: string;
  opts?: Parameters<typeof useEmblaCarousel>[0];
  setApi?: (api: CarouselApi) => void;
}

/**
 * Smooth draggable carousel with magnetic snap. Uses Embla for touch/mouse drag,
 * momentum, and snap-to-slide. Use everywhere you have horizontal scroll rows.
 */
const DraggableCarousel = ({
  children,
  className,
  contentClassName,
  slideClassName,
  opts,
  setApi,
}: DraggableCarouselProps) => {
  const [emblaRef, api] = useEmblaCarousel(
    {
      axis: 'x',
      align: 'start',
      containScroll: 'trimSnaps',
      dragFree: false,
      loop: false,
      skipSnaps: false,
      ...opts,
    },
    []
  );

  useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
    return () => setApi(undefined as unknown as CarouselApi);
  }, [api, setApi]);

  return (
    <div
      ref={emblaRef}
      className={cn('w-full overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-x', className)}
    >
      <div
        className={cn('flex items-start gap-4 will-change-transform', contentClassName)}
        style={{ backfaceVisibility: 'hidden' as const  }}
      >
        {React.Children.map(children, (child) =>
          child != null ? (
            <div className={cn('flex-shrink-0 w-fit', slideClassName)}>{child}</div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default DraggableCarousel;
export type { CarouselApi };
