import { AlbumFullImage } from './album-full-image';
import { AlbumPlaybackControls } from './album-playback-controls';
import { AlbumTrackList } from './album-track-list';
import { createTrackGroups } from '@/utils/library';
import { getContrastingTextColor } from '@/utils/color';
import { useRef } from 'react';
import type { AlbumWithTracksDto } from '@/hooks/user/use-albums';

export function AlbumExpandedDetails({ album }: { album: AlbumWithTracksDto }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedColor = album.coverImageMuted || '#000000';
  const contrastingColor = album.coverImageDarkMuted || '#000000';
  const trackGroups = createTrackGroups(album.tracks);
  const showDiscTitle = trackGroups[0]?.[0]?.discNumber !== trackGroups[trackGroups.length - 1]?.[0]?.discNumber;
  if (containerRef.current) {
    containerRef.current?.scrollIntoView();
  }
  return (
    <>
      <div
        className="relative w-full min-h-120 bg-muted/50"
        style={{
          backgroundColor: selectedColor,
        }}
      >
        {/* Image on the right */}
        <div className="absolute z-1 top-0 right-0 w-120 h-full overflow-hidden">
          <AlbumFullImage albumId={album.id} size={600} className="absolute z-0 w-120 h-120 object-cover" />
          <div className="absolute top-120 right-0 z-1 h-30 w-120 overflow-hidden">
            {/* Reflected image */}
            <div className="opacity-30">
              <AlbumFullImage albumId={album.id} size={600} className="absolute z-2 w-120 h-120 scale-y-[-1]" />
              <div
                className="absolute z-3 top-0 right-0 w-120 h-60"
                style={{
                  background: `linear-gradient(
                  to top,
                  ${selectedColor} 0%,
                  ${selectedColor} 50%,
                  transparent 100%
                )`,
                }}
              ></div>
            </div>
          </div>
          <div
            className="absolute z-2 top-0 -left-10 w-20 h-150"
            style={{
              background: `linear-gradient(
                to right,
                ${selectedColor} 0%,
                ${selectedColor} 50%,
                transparent 100%
              )`,
            }}
          ></div>
        </div>
        {/* Color overlay */}
        <div
          className="absolute z-2 w-full h-full"
          style={{
            background: `linear-gradient(
              to bottom right,
              ${contrastingColor} 10%,
              ${contrastingColor} 10%,
              transparent 100%
            )`,
          }}
        ></div>
        {/* Album data */}
        <div
          style={{ color: `${getContrastingTextColor(contrastingColor)}`, mixBlendMode: 'screen' }}
          aria-hidden="true"
        >
          {/* Physical filler */}
          <div className="p-4 lg:pl-8 mr-120 2xl:mr-140">
            <h3 className="font-semibold text-2xl mb-2">
              {album.displayName} <span className="text-sm opacity-50 align-middle">({album.year})</span>
            </h3>
            <AlbumPlaybackControls />
            <div className="lg:grid lg:grid-rows-2 2xl:grid-rows-none 2xl:grid-cols-2 gap-0 2xl:gap-20 max-w-400">
              {trackGroups.map((trackGroup, index) => {
                return (
                  <div key={index}>
                    {showDiscTitle && (
                      <h4 className="uppercase font-semibold text-xs mb-2 opacity-35">Disc {index + 1}</h4>
                    )}
                    <AlbumTrackList key={index} tracks={trackGroup} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Stacked overlay */}
        <div className="w-full absolute z-3 top-0">
          <div className="p-4 lg:pl-8 mr-120 2xl:mr-140 opacity-75" ref={containerRef}>
            <h3 className="font-semibold text-2xl mb-2">
              {album.displayName} <span className="text-sm opacity-50 align-middle">({album.year})</span>
            </h3>
            <AlbumPlaybackControls />
            <div className="lg:grid lg:grid-rows-2 2xl:grid-rows-none 2xl:grid-cols-2 gap-0 2xl:gap-20 max-w-400">
              {trackGroups.map((trackGroup, index) => (
                <div key={index}>
                  {showDiscTitle && (
                    <h4 className="uppercase font-semibold text-xs mb-2 opacity-35">Disc {index + 1}</h4>
                  )}
                  <AlbumTrackList tracks={trackGroup} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
