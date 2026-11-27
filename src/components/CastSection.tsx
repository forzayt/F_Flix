import { motion } from 'framer-motion';
import { Cast, getImageUrl } from '@/services/tmdb';
import DraggableCarousel from './DraggableCarousel';
import { staggerItem } from '@/lib/motion';

interface CastSectionProps {
  cast: Cast[];
}

const CastSection = ({ cast }: CastSectionProps) => {
  if (!cast.length) return null;

  return (
    <section className="py-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="brand-gradient h-5 w-1 rounded-full" />
        <h2 className="font-display text-xl font-bold text-white">Cast</h2>
      </div>

      <DraggableCarousel contentClassName="gap-4" className="py-2">
        {cast.slice(0, 12).map((person) => (
          <motion.div
            key={person.id}
            variants={staggerItem}
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="w-[150px] md:w-[170px]"
          >
            <div className="group overflow-hidden rounded-2xl border border-white/10 bg-secondary shadow-[0_18px_45px_-28px_rgba(0,0,0,0.95)]">
              <div className="aspect-[2/3] overflow-hidden">
                <img
                  src={getImageUrl(person.profile_path, 'w300')}
                  alt={person.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
            <p className="mt-2 line-clamp-1 text-sm font-medium text-white/90">
              {person.name}
            </p>
            <p className="line-clamp-1 text-xs text-white/40">{person.character}</p>
          </motion.div>
        ))}
      </DraggableCarousel>
    </section>
  );
};

export default CastSection;
