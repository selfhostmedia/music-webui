import { Button } from './ui/button';
import { ListEnd, ListStart, Play } from 'lucide-react';
import { secondsToMinutesAndSeconds } from '@/utils/format';
import type { AlbumWithTracksDto } from '@/hooks/user/use-library';

type TrackDto = AlbumWithTracksDto['tracks'][number];

export function AlbumTrackList({ tracks }: { tracks: TrackDto[] }) {
  return (
    <ol>
      {tracks.map((track) => (
        <li
          key={`filler-${track.id}`}
          className="flex justify-between border-dotted border-b border-background/25 py-2"
        >
          <span className="text-foreground/90">
            {track.trackNumber}. {track.title}
          </span>
          <div>
            <span className="opacity-50 text-sm pt-0.5">{secondsToMinutesAndSeconds(track.duration)}</span>
            <menu className="inline-block opacity-75">
              <Button variant="ghost" className="inline w-fit self-start p-1 mx-1 px-2">
                <Play />
              </Button>
              <Button variant="ghost" aria-label="Queue at end of queue" className="inline w-fit self-start p-1 mr-1 px-2">
                <ListStart className="scale-x-[-1]" />
              </Button>
              <Button variant="ghost" aria-label="Queue at start of queue" className="inline w-fit self-start p-1 px-2">
                <ListEnd />
              </Button>
            </menu>
          </div>
        </li>
      ))}
    </ol>
  );
}
