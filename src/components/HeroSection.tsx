import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Info, Pause, Play, Star } from 'lucide-react';
import { getBackdropUrl, Movie, TVShow } from '@/services/tmdb';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { easeOutExpo } from '@/lib/motion';

interface HeroSectionProps {
  items: (Movie | TVShow)[];
}

const contentVariants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo, staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOutExpo } },
};

const HeroSection = ({ items }: HeroSectionProps) => {
  const autoplayRef = useRef(
    Autoplay({ delay: 7000, stopOnInteraction: false, stopOnMouseEnter: false })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [
    autoplayRef.current,
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();

    const onAutoplayPlay = () => setIsPlaying(true);
    const onAutoplayStop = () => setIsPlaying(false);

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    emblaApi.on('autoplay:play', onAutoplayPlay);
    emblaApi.on('autoplay:stop', onAutoplayStop);

    if (!autoplayRef.current.isPlaying()) {
      autoplayRef.current.play();
    }

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
      emblaApi.off('autoplay:play', onAutoplayPlay);
      emblaApi.off('autoplay:stop', onAutoplayStop);
    };
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const toggleAutoplay = () => {
    const autoplay = autoplayRef.current;
    if (autoplay.isPlaying()) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="relative h-[86vh] min-h-[620px] w-full overflow-hidden">
      <div className="h-full w-full" ref={emblaRef}>
        <div className="flex h-full">
          {items.map((item, index) => {
            const title = 'title' in item ? item.title : item.name;
            const date = 'release_date' in item ? item.release_date : item.first_air_date;
            const year = date ? new Date(date).getFullYear() : '';
            const backdropUrl = getBackdropUrl(item.backdrop_path, 'w1280');
            const type = 'title' in item ? 'movie' : 'tv';
            const isActive = index === selectedIndex;

            return (
              <div
                key={item.id}
                className="relative h-full min-w-0 flex-[0_0_100%] overflow-hidden"
              >
                {backdropUrl && (
                  <img
                    src={backdropUrl}
                    alt={title}
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className="absolute inset-0 h-full w-full scale-[1.02] object-cover object-top"
                  />
                )}

                {/* Cinematic overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/75 via-black/20 to-transparent" />

                <div className="absolute inset-0 flex items-end pb-24 md:items-center md:pb-0">
                  <div className="w-full px-5 md:pl-[132px] md:pr-16">
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      animate={isActive ? 'show' : 'hidden'}
                      className="max-w-2xl space-y-5"
                    >
                      <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/70"
                      >
                        <span className="brand-gradient h-1.5 w-1.5 rounded-full" />
                        Featured
                        <span className="h-1 w-1 rounded-full bg-white/30" />
                        {type === 'movie' ? 'Movie' : 'TV Series'}
                      </motion.div>

                      <motion.h1
                        variants={itemVariants}
                        className="font-display text-4xl font-extrabold leading-[0.95] text-white text-shadow sm:text-5xl md:text-6xl lg:text-7xl"
                      >
                        {title}
                      </motion.h1>

                      <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap items-center gap-4 text-sm font-medium text-white/70"
                      >
                        <span className="flex items-center gap-1.5">
                          <Star size={15} className="fill-amber-400 text-amber-400" />
                          <span className="text-white">{item.vote_average.toFixed(1)}</span>
                        </span>
                        <span className="h-1 w-1 rounded-full bg-white/30" />
                        <span>{year}</span>
                        <span className="h-1 w-1 rounded-full bg-white/30" />
                        <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-white/80 backdrop-blur-md">
                          {type === 'movie' ? 'Movie' : 'Series'}
                        </span>
                      </motion.div>

                      <motion.p
                        variants={itemVariants}
                        className="max-w-xl text-sm leading-relaxed text-white/70 md:text-base"
                      >
                        {item.overview}
                      </motion.p>

                      <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap items-center gap-3 pt-2"
                      >
                        <Link
                          to={`/watch/${type}/${item.id}`}
                          className="brand-gradient glow-primary group inline-flex h-12 items-center gap-2 rounded-2xl px-7 text-sm font-semibold text-white transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                        >
                          <Play size={17} fill="currentColor" />
                          Watch now
                        </Link>
                        <Link
                          to={`/${type}/${item.id}`}
                          aria-label="More info"
                          className="glass flex h-12 w-12 items-center justify-center rounded-2xl text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Info size={19} />
                        </Link>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-6 right-4 z-20 flex items-center gap-4 md:bottom-8 md:right-12">
        <button
          onClick={scrollPrev}
          aria-label="Previous featured title"
          className="glass flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-1.5">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollTo(index)}
              aria-label={`Go to featured title ${index + 1}`}
              className={cn(
                'relative h-1 overflow-hidden rounded-full bg-white/20 transition-all duration-300',
                index === selectedIndex ? 'w-10' : 'w-5 hover:bg-white/35'
              )}
            >
              {index === selectedIndex && isPlaying && (
                <motion.span
                  key={`progress-${selectedIndex}`}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 7, ease: 'linear' }}
                  className="brand-gradient absolute inset-y-0 left-0"
                />
              )}
              {index === selectedIndex && !isPlaying && (
                <span className="brand-gradient absolute inset-0" />
              )}
            </button>
          ))}
        </div>

        <button
          onClick={scrollNext}
          aria-label="Next featured title"
          className="glass flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <ChevronRight size={18} />
        </button>

        <button
          onClick={toggleAutoplay}
          aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          className="glass flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
