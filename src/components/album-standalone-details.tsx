import { AlbumFullImage } from './album-full-image';
import { AlbumTrackList } from './album-track-list';
import { ArrowLeftCircle } from 'lucide-react';
import { Button } from './ui/button';
import { createTrackGroups } from '@/utils/library';
import { getContrastingTextColor } from '@/utils/color';
import { useRef } from 'react';
import type { AlbumWithTracksDto } from '@/hooks/user/use-albums';

export function AlbumStandaloneDetails({ album, onClose }: { album: AlbumWithTracksDto; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedColor = album.coverImageMuted || '#000000';
  const contrastingColor = album.coverImageDarkMuted || '#000000';
  const trackGroups = createTrackGroups(album.tracks);
  const showDiscTitle = trackGroups[0][0]?.discNumber !== trackGroups[trackGroups.length - 1][0]?.discNumber;

  return (
    <div
      className="w-full flex flex-col grow bg-muted/50 pl-8 -mx-4"
      ref={containerRef}
      style={{
        backgroundColor: selectedColor,
      }}
    >
      <menu className="opacity-75">
        <Button variant="ghost" onClick={onClose} className="inline w-fit self-start m-2">
          <ArrowLeftCircle />
          Back
        </Button>
      </menu>
      {/* Image on the right */}
      <AlbumFullImage albumId={album.id} size={600} className="w-full" />
      {/* Album data */}
      <div style={{ color: `${getContrastingTextColor(contrastingColor)}`, mixBlendMode: 'screen' }}>
        {/* Physical filler */}
        <div className="p-8">
          <h3 className="font-semibold text-2xl mb-2">
            {album.displayName} <span className="text-xs">{album.year}</span>
          </h3>
          {trackGroups.map((trackGroup, index) => (
            <div key={index}>
              {showDiscTitle && <h4 className="uppercase font-semibold text-xs mb-2 opacity-35">Disc {index + 1}</h4>}
              <AlbumTrackList tracks={trackGroup} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
