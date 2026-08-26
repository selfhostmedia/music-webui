import { useEffect, useState } from 'react';
import api from '@/lib/api';
import type { AlbumWithTracksDto } from '@/hooks/user/use-library';

export function AlbumDetails({ album }: { album: AlbumWithTracksDto }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    async function fetchImage() {
      setImageUrl(null);
      const { data, error } = await api.get('/api/user/album-cover', {
        params: {
          query: {
            id: album.id,
            size: 600,
          },
          header: api.authHeader(),
        },
        parseAs: 'blob',
      });
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching album cover image:', error);
        return;
      }
      if (data) {
        const nextUrl = URL.createObjectURL(data);
        setImageUrl(nextUrl);
      }
    }

    fetchImage();
  }, [album.id]);

  function getContrastingTextColor(hexValue: string) {
    let hex = hexValue.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((char) => char + char)
        .join('');
    }
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
      throw new Error('Invalid hex color');
    }
    const r = parseInt(hex.slice(0, 2), 16) / 255;
    const g = parseInt(hex.slice(2, 4), 16) / 255;
    const b = parseInt(hex.slice(4, 6), 16) / 255;
    const linearize = (channel: number) => (channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    const luminance = 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
    const contrastWithBlack = (luminance + 0.05) / 0.05;
    const contrastWithWhite = 1.05 / (luminance + 0.05);
    return contrastWithWhite >= contrastWithBlack ? '#fff' : '#000';
  }

  function secondsToMinutesAndSeconds(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  const colorOptions = [
    album.coverImageDarkMuted || '#000000',
    album.coverImageDarkVibrant || '#FFFFFF',
    album.coverImageLightMuted || '#000000',
    album.coverImageLightVibrant || '#FFFFFF',
    album.coverImageMuted || '#000000',
    album.coverImageVibrant || '#FFFFFF',
  ];
  const selectedColor = colorOptions[4];
  const contrastingColor = colorOptions[0];

  type TrackDto = AlbumWithTracksDto['tracks'][number];

  const discs: TrackDto[][] = [];
  for (let i = 0; i < album.tracks.length; i += 1) {
    const track = album.tracks[i];
    if (track) {
      const disc = album.tracks[i].discNumber || 1;
      if (discs[disc - 1] === undefined) {
        discs[disc - 1] = [];
      }
      discs[disc - 1].push(track);
    }
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
          <img className="absolute z-0 w-120 h-120 object-cover" src={imageUrl || ''} alt={album.displayName} />
          <div className="absolute top-120 right-0 z-1 h-30 w-120 overflow-hidden">
            {/* Reflected image */}
            <div className="opacity-30">
              <img src={imageUrl || ''} alt="" aria-hidden="true" className="absolute z-2 h-120 w-120 scale-y-[-1]" />
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
        <div style={{ color: `${getContrastingTextColor(contrastingColor)}`, mixBlendMode:  'screen' }}>
          {/* Physical filler */}
          <div className="p-4 lg:pl-8 mr-120 2xl:mr-140">
            <h3 className="font-semibold text-2xl mb-2">{album.displayName}</h3>
            <div className="grid grid-rows-2 2xl:grid-rows-none 2xl:grid-cols-2 gap-0 2xl:gap-20 w-full max-w-400">
              <ol>
                {album.tracks.slice(0, Math.ceil(album.tracks.length / 2)).map((track) => (
                  <li key={track.id} className="flex justify-between border-dotted border-b border-background/25 py-1">
                    <span className="">
                      {track.trackNumber}. {track.title}
                    </span>
                    <span className="opacity-50 text-sm pt-0.5">{secondsToMinutesAndSeconds(track.duration)}</span>
                  </li>
                ))}
              </ol>
              <ol>
                {album.tracks.slice(Math.ceil(album.tracks.length / 2)).map((track) => (
                  <li key={track.id} className="flex justify-between border-dotted border-b border-background/25 py-1">
                    <span className="">
                      {track.trackNumber}. {track.title}
                    </span>
                    <span className="opacity-50 text-sm pt-0.5">{secondsToMinutesAndSeconds(track.duration)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        {/* Stacked overlay */}
        <div className="w-full absolute z-3 top-0">
          <div className="p-4 lg:pl-8 mr-120 2xl:mr-140 opacity-75">
            <h3 className="font-semibold text-2xl mb-2">{album.displayName}</h3>
            <div className="grid grid-rows-2 2xl:grid-rows-none 2xl:grid-cols-2 gap-0 2xl:gap-20 max-w-400">
              <ol>
                {album.tracks.slice(0, Math.ceil(album.tracks.length / 2)).map((track) => (
                  <li
                    key={track.id}
                    className="flex justify-between border-dotted border-b border-background/25 py-1"
                  >
                    <span className="">
                      {track.trackNumber}. {track.title}
                    </span>
                    <span className="opacity-50 text-sm pt-0.5">{secondsToMinutesAndSeconds(track.duration)}</span>
                  </li>
                ))}
              </ol>
              <ol>
                {album.tracks.slice(Math.ceil(album.tracks.length / 2)).map((track) => (
                  <li
                    key={track.id}
                    className="flex justify-between border-dotted border-b border-background/25 py-1"
                  >
                    <span className="">
                      {track.trackNumber}. {track.title}
                    </span>
                    <span className="opacity-50 text-sm pt-0.5">{secondsToMinutesAndSeconds(track.duration)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // return (
  //   <div
  //     className={[
  //       'grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out w-full mb-4',
  //       'grid-rows-[2fr]',
  //       'min-h-140',
  //     ].join(' ')}
  //   >
  //     <div className="relative overflow-hidden z-1 w-full h-full mt-2 border-t border-b bg-muted/50">
  //       <div
  //         className="-z-1 absolute h-full w-full"
  //         style={{
  //           backgroundImage: [
  //             `linear-gradient(to bottom right, ${selectedColor} 10%, ${selectedColor} 10%, transparent 100%)`,
  //             imageUrl ? `url("${imageUrl}")` : undefined,
  //           ]
  //             .filter(Boolean)
  //             .join(', '),
  //           backgroundPosition: 'top right',
  //           backgroundSize: 'auto 100%',
  //           backgroundRepeat: 'no-repeat',
  //           // backgroundColor: selectedColor || '#000000',
  //         }}
  //       >
  //         <div
  //           className="p-4 pl-8"
  //           style={{ color: `${getContrastingTextColor(contrastingColor)}`, mixBlendMode: 'plus-darker' }}
  //         >
  //           <h3 className="font-semibold text-2xl mb-2">{album.displayName}</h3>
  //           <div className="grid grid-cols-2 gap-20">
  //             <ol>
  //               {album.tracks.slice(0, Math.ceil(album.tracks.length / 2)).map((track) => (
  //                 <li key={track.id} className="flex justify-between  border-dotted border-b border-background/25 py-1">
  //                   <span className="">
  //                     {track.trackNumber}. {track.title}
  //                   </span>
  //                   <span className="">{secondsToMinutesAndSeconds(track.duration)}</span>
  //                 </li>
  //               ))}
  //             </ol>
  //             <ol>
  //               {album.tracks.slice(Math.ceil(album.tracks.length / 2)).map((track) => (
  //                 <li key={track.id} className="flex justify-between  border-dotted border-b border-background/25 py-1">
  //                   <span className="">
  //                     {track.trackNumber}. {track.title}
  //                   </span>
  //                   <span className="">{secondsToMinutesAndSeconds(track.duration)}</span>
  //                 </li>
  //               ))}
  //             </ol>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
}
