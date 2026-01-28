import { useState } from 'react';
import { cn } from '@/lib/utils';
import { STREAM_SOURCES } from '@/constants/streamConstants';
import { Play, Server, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface StreamPlayerProps {
  id: number;
  imdbId?: string | null;
  type: 'movie' | 'tv' | 'anime';
  season?: number;
  episode?: number;
  title: string;
}

const StreamPlayer = ({ id, imdbId, type, season = 1, episode = 1, title }: StreamPlayerProps) => {
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getStreamUrl = (sourceUrl: string, sourceId: string) => {
    const color = 'E11D48'; // Primary theme color without #

    if (sourceId === 'videasy') {
      const commonParams = `color=${color}&nextEpisode=true&autoplayNextEpisode=true&episodeSelector=true&overlay=true`;
      if (type === 'movie') {
        return `${sourceUrl}/movie/${id}?${commonParams}`;
      } else if (type === 'tv') {
        return `${sourceUrl}/tv/${id}/${season}/${episode}?${commonParams}`;
      } else if (type === 'anime') {
        return `${sourceUrl}/anime/${id}/${episode}?${commonParams}`;
      }
    } else if (sourceId === 'vidsrc') {
      const identifier = imdbId || id;
      if (type === 'movie') {
        return `${sourceUrl}/movie/${identifier}`;
      } else if (type === 'tv' || type === 'anime') {
        // Most anime in TMDB are TV shows, so we use tv/id/s/e
        // If it's anime, season is usually 1, episode is the provided episode
        return `${sourceUrl}/tv/${identifier}/${type === 'anime' ? 1 : season}/${episode}`;
      }
    }
    return '';
  };

  const currentSource = STREAM_SOURCES.find(s => s.id === selectedSource);

  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 group">
      {!selectedSource ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 gap-8 p-6">
          <div className="flex flex-col items-center gap-2 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Select a Stream Server</h3>
            <p className="text-muted-foreground text-sm max-w-sm">
              We found multiple sources for <span className="text-primary font-medium">"{title}"</span>. Choose one to start watching.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg animate-in fade-in zoom-in-95 duration-700 delay-200">
            {STREAM_SOURCES.map((source, index) => (
              <button
                key={source.id}
                onClick={() => setSelectedSource(source.id)}
                className="group/btn relative flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 text-left overflow-hidden"
              >
                {index === 0 && (
                  <div className="absolute top-0 right-0 px-3 py-1 bg-primary text-[10px] font-bold text-white rounded-bl-xl uppercase tracking-tighter">
                    Recommended
                  </div>
                )}
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover/btn:scale-110 transition-transform duration-500 shadow-inner">
                  <Server size={28} />
                </div>
                <div className="flex flex-col">
                  <div className="font-bold text-white group-hover/btn:text-primary transition-colors text-lg">
                    {source.name}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Fast Connection
                  </div>
                </div>
                <div className="absolute right-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 -translate-x-2 transition-all duration-300">
                  <Play size={20} className="text-primary fill-primary" />
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground/60 mt-4 animate-in fade-in duration-1000 delay-500">
            <Info size={14} />
            <span>If one server doesn't work, try switching to another.</span>
          </div>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-zinc-950 z-10 transition-opacity duration-500">
              <div className="flex flex-col items-center gap-5">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                  <div className="absolute top-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-white font-semibold tracking-wide">Connecting to {currentSource?.name}...</p>
                  <p className="text-xs text-muted-foreground">Preparing your high quality stream</p>
                </div>
              </div>
            </div>
          )}

          <div className="absolute top-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setSelectedSource(null);
                setIsLoading(true);
              }}
              className="bg-black/60 backdrop-blur-xl border border-white/10 hover:bg-primary hover:text-white transition-all duration-300 text-xs gap-2 font-bold px-4 py-2 rounded-full shadow-2xl"
            >
              <Server size={14} />
              Switch Server
            </Button>
          </div>

          <iframe
            src={getStreamUrl(currentSource!.url, currentSource!.id)}
            title={title}
            className={cn(
              "w-full h-full border-0 transition-opacity duration-700 delay-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            onLoad={() => setIsLoading(false)}
          />
        </>
      )}
    </div>
  );
};

export default StreamPlayer;
