import { TrackPlaybackControls } from './track-playback-controls';
import { secondsToMinutesAndSeconds } from '@/utils/format';
import type { AlbumWithTracksDto } from '@/hooks/user/use-albums';

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
            <TrackPlaybackControls />
          </div>
        </li>
      ))}
    </ol>
  );
}
