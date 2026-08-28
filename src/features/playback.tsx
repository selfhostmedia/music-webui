import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { TrackDto } from '@/hooks/user/use-library';

type PlaybackContextValue = {
  queue: TrackDto[];
};

const PlaybackContext = createContext<PlaybackContextValue | null>(null);

export function PlaybackProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [queue, setQueue] = useState<TrackDto[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const currentTrack = currentIndex >= 0 ? queue[currentIndex] : null;

  const playTrack = useCallback((track: TrackDto, tracks: TrackDto[] = [track]) => {
    const index = tracks.findIndex((item) => item.id === track.id);

    setQueue(tracks);
    setCurrentIndex(index >= 0 ? index : 0);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((playing) => !playing);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((index) => (index < queue.length - 1 ? index + 1 : index));
  }, [queue.length]);

  const previous = useCallback(() => {
    setCurrentIndex((index) => Math.max(index - 1, 0));
  }, []);

  // Load a new track into the audio element.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && currentTrack) {
      // audio.src = currentTrack.streamUrl;
      audio.load();

      if (isPlaying) {
        audio.play().catch(() => {
          // Browser may require a user gesture before playing.
          setIsPlaying(false);
        });
      }
    }
  }, [currentTrack]); // Deliberately do not include isPlaying here.

  // React to play/pause changes.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Subscribe to native audio events.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const onTimeUpdate = () => setCurrentTime(audio.currentTime);
      const onLoadedMetadata = () => setDuration(audio.duration);
      const onEnded = () => {
        if (currentIndex < queue.length - 1) {
          setCurrentIndex((index) => index + 1);
        } else {
          setIsPlaying(false);
        }
      };
      audio.addEventListener('timeupdate', onTimeUpdate);
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('ended', onEnded);
      return () => {
        audio.removeEventListener('timeupdate', onTimeUpdate);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('ended', onEnded);
      };
    }
    return undefined;
  }, [currentIndex, queue.length]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const seek = useCallback((seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
  }, []);

  const value = {
    queue,
    currentTrack,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    volume,
    setVolume,
    playTrack,
    togglePlay,
    next,
    previous,
    seek,
  };

  return (
    <PlaybackContext.Provider value={value}>
      <audio ref={audioRef} preload="metadata" />
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback(): React.ContextType<typeof PlaybackContext> {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within PlaybackProvider');
  }
  return context;
}
