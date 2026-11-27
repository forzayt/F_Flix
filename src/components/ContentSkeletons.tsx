import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const gridClass =
  'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6';

interface SkeletonProps {
  className?: string;
}

/** A single poster card placeholder that matches MovieCard's layout. */
export const PosterCardSkeleton = ({ className }: SkeletonProps) => (
  <div className={cn('w-full space-y-3', className)}>
    <Skeleton className="aspect-[2/3] w-full rounded-lg" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
  </div>
);

/** Grid of poster card placeholders used by Movies / TV / Anime / Search. */
export const ContentGridSkeleton = ({
  count = 18,
  className,
}: SkeletonProps & { count?: number }) => (
  <div className={cn(gridClass, className)} aria-busy="true" aria-label="Loading content">
    {Array.from({ length: count }).map((_, i) => (
      <PosterCardSkeleton key={i} />
    ))}
  </div>
);

/** Horizontal row placeholder used on the home page while rows load. */
export const MovieRowSkeleton = ({ cards = 7 }: { cards?: number }) => (
  <section className="relative py-6" aria-busy="true" aria-label="Loading row">
    <Skeleton className="mx-4 mb-4 h-6 w-48 md:mx-12 md:h-7" />
    <div className="flex gap-4 overflow-hidden px-4 md:px-12">
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          className="w-[120px] flex-shrink-0 space-y-3 md:w-[160px]"
        >
          <Skeleton className="aspect-[2/3] w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  </section>
);

/** Full hero placeholder that mirrors HeroSection's dimensions. */
export const HeroSkeleton = () => (
  <div
    className="relative h-[70vh] w-full overflow-hidden md:h-[85vh]"
    aria-busy="true"
    aria-label="Loading featured titles"
  >
    <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
    <div className="absolute inset-0 flex items-end pb-24 md:pb-32">
      <div className="w-full max-w-2xl space-y-4 px-4 md:px-12">
        <Skeleton className="h-10 w-2/3 md:h-16" />
        <Skeleton className="h-5 w-44" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-12 w-36 rounded-md" />
          <Skeleton className="h-12 w-32 rounded-md" />
        </div>
      </div>
    </div>
  </div>
);

/** Detail page placeholder (hero banner + title/meta/overview). */
export const DetailsSkeleton = () => (
  <div className="pt-20" aria-busy="true" aria-label="Loading details">
    <Skeleton className="h-[60vh] w-full rounded-none" />
    <div className="max-w-4xl space-y-4 px-4 py-8 md:px-12">
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-12 w-40 rounded-md" />
      </div>
    </div>
  </div>
);

/** Player page placeholder that keeps the same header + video frame layout. */
export const PlayerSkeleton = () => (
  <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading player">
    <div className="flex items-center justify-between border-b border-white/5 bg-gradient-to-b from-background to-transparent p-4 md:px-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-10 w-10 rounded-full" />
    </div>
    <main className="px-4 py-6 md:px-12">
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-full max-w-4xl" />
          <Skeleton className="h-4 w-2/3 max-w-4xl" />
        </div>
      </div>
    </main>
  </div>
);
