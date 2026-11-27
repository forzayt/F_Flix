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
    <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
    <Skeleton className="h-4 w-3/4 rounded-md" />
    <Skeleton className="h-3 w-1/2 rounded-md" />
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
  <section className="relative py-5" aria-busy="true" aria-label="Loading row">
    <div className="mb-4 flex items-center justify-between px-4 md:px-12">
      <Skeleton className="h-6 w-48 rounded-lg md:h-7" />
      <Skeleton className="h-4 w-16 rounded-md" />
    </div>
    <div className="flex gap-4 overflow-hidden px-4 py-3 md:px-12">
      {Array.from({ length: cards }).map((_, i) => (
        <div
          key={i}
          className="w-[125px] flex-shrink-0 space-y-3 md:w-[165px]"
        >
          <Skeleton className="aspect-[2/3] w-full rounded-2xl" />
          <Skeleton className="h-4 w-3/4 rounded-md" />
          <Skeleton className="h-3 w-1/2 rounded-md" />
        </div>
      ))}
    </div>
  </section>
);

/** Full hero placeholder that mirrors HeroSection's dimensions. */
export const HeroSkeleton = () => (
  <div
    className="relative h-[86vh] min-h-[620px] w-full overflow-hidden"
    aria-busy="true"
    aria-label="Loading featured titles"
  >
    <Skeleton className="absolute inset-0 h-full w-full rounded-none" />
    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
    <div className="absolute inset-0 flex items-end pb-24 md:items-center md:pb-0">
      <div className="w-full max-w-2xl space-y-5 px-5 md:pl-[132px] md:pr-16">
        <Skeleton className="h-4 w-32 rounded-md" />
        <Skeleton className="h-12 w-4/5 rounded-xl md:h-20" />
        <Skeleton className="h-5 w-52 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
        <Skeleton className="h-4 w-5/6 rounded-md" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-12 w-36 rounded-2xl" />
          <Skeleton className="h-12 w-12 rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);

/** Detail page placeholder (hero banner + title/meta/overview). */
export const DetailsSkeleton = () => (
  <div className="md:-ml-[84px]" aria-busy="true" aria-label="Loading details">
    <Skeleton className="h-[60vh] w-full rounded-none" />
    <div className="max-w-4xl space-y-4 px-4 py-8 md:pl-[132px] md:pr-12">
      <Skeleton className="h-10 w-2/3 rounded-xl" />
      <Skeleton className="h-6 w-1/3 rounded-lg" />
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-5/6 rounded-md" />
      <Skeleton className="h-4 w-3/4 rounded-md" />
      <div className="flex gap-4 pt-4">
        <Skeleton className="h-12 w-40 rounded-2xl" />
      </div>
    </div>
  </div>
);

/** Player page placeholder that matches the full-size player layout. */
export const PlayerSkeleton = () => (
  <div className="min-h-screen w-full bg-black" aria-busy="true" aria-label="Loading player">
    <div className="flex h-16 items-center justify-between border-b border-white/[0.06] bg-black/70 px-3 md:px-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-40 rounded-md" />
          <Skeleton className="h-3 w-24 rounded-md" />
        </div>
      </div>
      <Skeleton className="h-10 w-10 rounded-xl" />
    </div>

    <Skeleton className="h-[calc(100dvh-4rem)] min-h-[320px] w-full rounded-none" />

    <div className="w-full border-t border-white/[0.06] px-4 py-6 md:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-4">
        <Skeleton className="h-8 w-1/2 rounded-lg" />
        <Skeleton className="h-4 w-full max-w-4xl rounded-md" />
        <Skeleton className="h-4 w-2/3 max-w-4xl rounded-md" />
      </div>
    </div>
  </div>
);
