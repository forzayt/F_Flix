import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { DEFAULT_STREAM_SOURCE } from '@/constants/sources';

interface StreamPlayerProps {
  id: number;
  imdbId?: string | null;
  type: 'movie' | 'tv' | 'anime';
  season?: number;
  episode?: number;
  title: string;
}

const StreamPlayer = ({ id, imdbId, type, season = 1, episode = 1, title }: StreamPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const streamUrl = DEFAULT_STREAM_SOURCE.buildUrl({ id, imdbId, type, season, episode });

  // Show the loader again whenever the stream changes (e.g. switching episodes).
  useEffect(() => {
    setIsLoading(true);
  }, [streamUrl]);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10 transition-opacity duration-500">
          <div className="flex flex-col items-center gap-5">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
              <div className="absolute top-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="text-white font-semibold tracking-wide">Connecting to {DEFAULT_STREAM_SOURCE.name}...</p>
              <p className="text-xs text-muted-foreground">Preparing your high quality stream</p>
            </div>
          </div>
        </div>
      )}

      <iframe
        key={streamUrl}
        src={streamUrl}
        title={title}
        className={cn(
          "w-full h-full border-0 transition-opacity duration-700 delay-300",
          isLoading ? "opacity-0" : "opacity-100"
        )}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default StreamPlayer;
