import { Button } from './ui/button';
import { ListEnd, ListStart, Play } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLibrary } from '@/features/library/library';
import { useQueue } from '@/features/library/queue';
import type {
  Album,
  ArtistWithContents,
  ComposerWithContents,
  GenreWithContents,
  Track,
  TrackWithContent,
  TreeItemDto,
} from '@/features/library/library';

export function PlaybackControls({
  album,
  artist,
  composer,
  file,
  genre,
  textLabels,
  track,
  className,
}: {
  album?: Album;
  artist?: ArtistWithContents;
  composer?: ComposerWithContents;
  file?: TreeItemDto;
  genre?: GenreWithContents;
  textLabels?: boolean;
  track?: Track;
  className?: string;
}) {
  const { queue, setQueue, togglePlay } = useQueue();
  const { tracks } = useLibrary();
  const [autoPlay, setAutoPlay] = useState(false);

  const getTracks = (): TrackWithContent[] => {
    if (album) {
      return album.tracks as TrackWithContent[];
    }
    if (track) {
      return [track] as TrackWithContent[];
    }
    if (artist) {
      return artist.albums.flatMap((item) => item.tracks) as TrackWithContent[];
    }
    if (composer) {
      return composer.albums.flatMap((item) => item.tracks) as TrackWithContent[];
    }
    if (genre) {
      return genre.albums.flatMap((item) => item.tracks) as TrackWithContent[];
    }
    if (file) {
      return tracks.filter((t: TrackWithContent) => t.id === file.id) as TrackWithContent[];
    }
    return [];
  };

  const addTracksToQueue = (start = true) => {
    const items = getTracks();
    if (start) {
      setQueue([...items, ...queue]);
    } else {
      setQueue([...queue, ...items]);
    }
  };

  const replaceQueue = () => {
    const items = getTracks();
    setQueue(items);
    setAutoPlay(true);
  };

  useEffect(() => {
    if (autoPlay && queue.length > 0) {
      togglePlay(true);
      setAutoPlay(false);
    }
  }, [autoPlay, queue]);

  return (
    <menu className={`opacity-75 flex flex-row ${className || ''}`}>
      <Button variant="ghost" className="w-fit self-start p-1 mx-1 px-2" aria-label="Play now" onClick={replaceQueue}>
        <Play /> {textLabels ? <span>Play</span> : null}
      </Button>
      <Button
        variant="ghost"
        aria-label="Queue at end of queue"
        className="w-fit self-start p-1 mr-1 px-2"
        onClick={() => addTracksToQueue(true)}
      >
        <ListStart className="scale-x-[-1]" /> {textLabels ? <span>Queue at front</span> : null}
      </Button>
      <Button
        variant="ghost"
        aria-label="Queue at start of queue"
        className="w-fit self-start p-1 px-2"
        onClick={() => addTracksToQueue(false)}
      >
        <ListEnd /> {textLabels ? <span>Queue at end</span> : null}
      </Button>
    </menu>
  );
}
