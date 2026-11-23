import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { resolveStreamSource, StreamSourceOptions } from '@/constants/sources';

interface StreamPlayerProps {
  id: number;
  imdbId?: string | null;
  type: 'movie' | 'tv' | 'anime';
  season?: number;
  episode?: number;
  title: string;
}

const StreamPlayer = ({ id, imdbId, type, season = 1, episode = 1, title }: StreamPlayerProps) => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [sourceName, setSourceName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let cancelled = false;
    const options: StreamSourceOptions = { id, imdbId, type, season, episode };

    setIsLoading(true);
    setStreamUrl(null);
    setSourceName(null);

    resolveStreamSource(options, controller.signal).then((source) => {
      if (cancelled || controller.signal.aborted) return;
      setSourceName(source.name);
      setStreamUrl(source.buildUrl(options));
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [id, imdbId, type, season, episode]);

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
              <p className="text-white font-semibold tracking-wide">
                {sourceName ? `Connecting to ${sourceName}...` : 'Finding a working server...'}
              </p>
              <p className="text-xs text-muted-foreground">Preparing your high quality stream</p>
            </div>
          </div>
        </div>
      )}

      {streamUrl && (
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
      )}
    </div>
  );
};

export default StreamPlayer;
