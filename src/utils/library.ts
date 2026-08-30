import type { AlbumWithTracksDto } from '@/hooks/user/use-albums';

type TrackDto = AlbumWithTracksDto['tracks'][number];

export function createTrackGroups(tracks: Array<TrackDto>) {
  if (tracks.length === 1) {
    return [tracks];
  }
  const discs: TrackDto[][] = [];
  for (let i = 0; i < tracks.length; i += 1) {
    const track = tracks[i];
    if (track) {
      const disc = tracks[i].discNumber || 1;
      if (discs[disc - 1] === undefined) {
        discs[disc - 1] = [];
      }
      discs[disc - 1].push(track);
    }
  }

  return discs.length === 1
    ? [tracks.slice(0, Math.ceil(tracks.length / 2)), tracks.slice(Math.ceil(tracks.length / 2))]
    : discs;
}
