import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  url: string;
  autoPlay?: boolean;
  className?: string;
}

const HLSPlayer: React.FC<HLSPlayerProps> = ({ url, autoPlay = true, className = "" }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let hls: Hls | null = null;

    if (videoRef.current) {
      const video = videoRef.current;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native support (Safari)
        video.src = url;
        if (autoPlay) {
          video.play().catch(e => console.error("Error playing video:", e));
        }
      } else if (Hls.isSupported()) {
        // Hls.js support
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(url);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) {
            video.play().catch(e => console.error("Error playing video:", e));
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error("Fatal network error encountered, trying to recover");
                hls?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("Fatal media error encountered, trying to recover");
                hls?.recoverMediaError();
                break;
              default:
                console.error("Fatal error, cannot recover");
                hls?.destroy();
                break;
            }
          }
        });
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [url, autoPlay]);

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-2xl bg-black ${className}`}>
      <video
        ref={videoRef}
        controls
        className="w-full h-full"
        playsInline
      />
    </div>
  );
};

export default HLSPlayer;
