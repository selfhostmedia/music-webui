import { AlbumExpandedDetails } from './album-expanded-details';
import type { TrackComposerWithTracksDto } from '@/hooks/user/use-composers';

export function ComposerExpandedDetails({ composer }: { composer: TrackComposerWithTracksDto }) {
  return (
    <>
      {composer.albums.map((album) => {
        return <AlbumExpandedDetails album={album} />;
      })}
    </>
  );
}
