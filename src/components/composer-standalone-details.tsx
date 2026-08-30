import { AlbumStandaloneDetails } from './album-standalone-details';
import type { TrackComposerWithTracksDto } from '@/hooks/user/use-composers';

export function ComposerStandaloneDetails({
  composer,
  onClose,
}: {
  composer: TrackComposerWithTracksDto;
  onClose: () => void;
}) {
  return composer.albums.map((album) => {
    return <AlbumStandaloneDetails album={album} onClose={onClose} />;
  });
}
