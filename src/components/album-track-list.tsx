import { secondsToMinutesAndSeconds } from '@/utils/format';
import type { AlbumWithTracksDto } from '@/hooks/user/use-library';

type TrackDto = AlbumWithTracksDto['tracks'][number];

export function AlbumTrackList({ tracks }: { tracks: TrackDto[] }) {
  return (
    <ol>
      {tracks.map((track) => (
        <li
          key={`filler-${track.id}`}
          className="flex justify-between border-dotted border-b border-background/25 py-1"
        >
          <span className="">
            {track.trackNumber}. {track.title}
          </span>
          <span className="opacity-50 text-sm pt-0.5">{secondsToMinutesAndSeconds(track.duration)}</span>
        </li>
      ))}
    </ol>
  );
}
