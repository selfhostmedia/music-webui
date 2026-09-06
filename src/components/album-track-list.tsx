import { PlaybackControls } from './playback-controls';
import { secondsToMinutesAndSeconds } from '@/utils/format';
import type { Track } from '@/features/library/library';

export function AlbumTrackList({ tracks }: { tracks: Track[] }) {
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
          <div className="flex flex-row">
            <span className="opacity-50 text-sm pt-0.5">{secondsToMinutesAndSeconds(track.duration)}</span>
            <PlaybackControls track={track} />
          </div>
        </li>
      ))}
    </ol>
  );
}
