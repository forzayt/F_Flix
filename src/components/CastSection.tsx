import { Cast, getImageUrl } from '@/services/tmdb';

interface CastSectionProps {
  cast: Cast[];
}

const CastSection = ({ cast }: CastSectionProps) => {
  if (!cast.length) return null;

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold mb-4">Cast</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {cast.slice(0, 10).map((person) => (
          <div key={person.id} className="flex-shrink-0 w-[240px] text-center">
            <div className="w-[240px] overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/10 bg-secondary">
              <img
                src={getImageUrl(person.profile_path, 'w500')}
                alt={person.name}
                className="w-full aspect-[2/3] object-cover"
                loading="lazy"
              />
            </div>
            <p className="mt-2 text-sm font-medium line-clamp-2">{person.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{person.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CastSection;