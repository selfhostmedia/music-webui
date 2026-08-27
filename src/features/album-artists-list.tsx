import { AlbumArtistListItem } from '@/components/artist-list-item';
import { AlbumArtistStandaloneDetails } from '@/components/artist-standalone-details';
import { ArtistCard } from '@/components/artist-card';
import { ArtistExpandedDetails } from '@/components/artist-expanded-details';
import { ArtistSortFieldEnum, SortDirectionEnum } from '@/types/api-schema';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useLibrary } from '@/hooks/user/use-library';
import { useNavigate, useParams } from 'react-router-dom';

export default function AlbumArtistsList() {
  const navigate = useNavigate();
  const {
    listAlbumArtistsWithTracks,
    albumArtistsWithTracks,
    albumArtistsWithTracksTotal,
    albumArtistsWithTracksOffset,
    albumArtistsWithTracksLoading,
    albumArtistsWithTracksError,
  } = useLibrary();
  const isMobile = useIsMobile();
  const [columnSize, setColumnSize] = useState(0);
  const listRef = useRef(null);
  const { artistId } = useParams<{ artistId: string }>();
  const expandedArtistId = artistId ? Number(artistId) : null;
  const expandedArtist =
    expandedArtistId !== null ? (albumArtistsWithTracks.find((album) => album.id === expandedArtistId) ?? null) : null;

  useLayoutEffect(() => {
    const list = listRef.current as HTMLElement | null;
    if (list) {
      const measureColumns = () => {
        const items = Array.from(list.querySelectorAll<HTMLElement>('li')) as HTMLElement[];
        if (items.length > 0) {
          const firstItem = items[0];
          let interruptedByExpandedAlbum = -1;
          for (let i = 1; i < items.length; i += 1) {
            const item = items[i];
            if (item.classList.contains('album-details')) {
              interruptedByExpandedAlbum = i;
              break;
            }
            if (item.offsetTop > firstItem.offsetTop) {
              setColumnSize(i);
              break;
            }
          }
          // find the first row-starting element after the expanded album details
          if (interruptedByExpandedAlbum > -1) {
            let newFirstItem = -1;
            for (let i = interruptedByExpandedAlbum + 1; i < items.length; i += 1) {
              const item = items[i];
              if (item.offsetLeft === firstItem.offsetLeft) {
                newFirstItem = i;
                break;
              }
            }
            // measure the column size starting from the new first item
            if (newFirstItem > -1) {
              const newFirst = items[newFirstItem];
              for (let i = newFirstItem + 1; i < items.length; i += 1) {
                const item = items[i];
                if (item.offsetTop > newFirst.offsetTop) {
                  const newColumnSize = i - newFirstItem;
                  if (newColumnSize > 0) {
                    setColumnSize(newColumnSize);
                  }
                  break;
                }
              }
            }
          }
        }
      };
      measureColumns();
      const observer = new ResizeObserver(measureColumns);
      observer.observe(list);
      window.addEventListener('resize', measureColumns);
      return () => {
        observer.disconnect();
        // window.removeEventListener('resize', measureColumns);
      };
    }
    return undefined;
  }, [albumArtistsWithTracks.length]);

  function formatSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFC')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\p{L}\p{N}-]+/gu, '')
      .replace(/-+/g, '-');
  }

  function toggleArtist(id: number) {
    console.log('toggleArtist called with id', id);
    if (expandedArtistId === id) {
      navigate('/album-artists');
    } else {
      const artist = albumArtistsWithTracks.find((item) => item.id === id);
      if (!artist) {
        // eslint-disable-next-line no-console
        console.error(`Artist with id ${id} not found`);
        return;
      }
      navigate(`/album-artists/${id}/${formatSlug(artist.name)}`);
    }
  }

  const clickedArtistIndex = albumArtistsWithTracks.findIndex((item) => item.id === expandedArtistId);
  const detailsInsertIndex =
    clickedArtistIndex >= 0 ? Math.ceil((clickedArtistIndex + 1) / columnSize) * columnSize - 1 : -1;
  const insertingArtist = albumArtistsWithTracks[clickedArtistIndex];

  console.log(
    'album artist lists',
    'expanded',
    expandedArtistId,
    'clickedArtistIndex',
    clickedArtistIndex,
    'detailsInsertIndex',
    detailsInsertIndex,
    'insertingArtist',
    insertingArtist,
  );

  useEffect(() => {
    listAlbumArtistsWithTracks({
      sortField: ArtistSortFieldEnum.artist,
      sortDirection: SortDirectionEnum.asc,
    });
  }, [listAlbumArtistsWithTracks]);

  return (
    <>
      <title>Album artists // SHM</title>
      {albumArtistsWithTracksLoading && <p>Loading...</p>}
      {albumArtistsWithTracksError && <p>Error: {albumArtistsWithTracksError.message}</p>}
      {isMobile && (
        <ul className="flex flex-col grow">
          {insertingArtist && (
            <li
              className="album-details col-span-full flex flex-col grow  -mx-4"
              key={`mobile-expanding-album-details ${insertingArtist.id}`}
            >
              {expandedArtist && (
                <AlbumArtistStandaloneDetails
                  artist={expandedArtist}
                  key={`mobile-album-details ${expandedArtist.id}`}
                  onClose={() => toggleArtist(expandedArtist.id)}
                />
              )}
            </li>
          )}
          {!insertingArtist &&
            albumArtistsWithTracks.map((item) => {
              return (
                <li className="w-full p-2" key={`mobile-album ${item.id}`}>
                  <AlbumArtistListItem
                    artist={item}
                    isExpanded={expandedArtistId === item.id}
                    onToggle={() => toggleArtist(item.id)}
                    key={`mobile-album-list-item ${item.id}`}
                  />
                </li>
              );
            })}
        </ul>
      )}
      {!isMobile && (
        <ul
          ref={listRef}
          className={[
            'grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))]',
            'md:grid-cols-[repeat(auto-fill,minmax(14rem,1fr))]',
            'lg:grid-cols-[repeat(auto-fill,minmax(20rem,1fr))] ',
            'gap-4 mx-4',
          ].join(' ')}
        >
          {albumArtistsWithTracks.map((item, index) => {
            const isExpanded = expandedArtistId === item.id;
            const shouldInsertDetails = detailsInsertIndex === index;
            return (
              <Fragment>
                <li className="w-full h-full inline-block" key={`album ${item.id}`}>
                  <ArtistCard
                    key={`album-card ${item.id}`}
                    artist={item}
                    isExpanded={isExpanded}
                    onToggle={() => toggleArtist(item.id)}
                  />
                </li>
                {shouldInsertDetails && (
                  <li
                    className="album-details col-span-full -mx-4"
                    key={`expanding-album-details ${insertingArtist.id}`}
                  >
                    {expandedArtist && (
                      <ArtistExpandedDetails artist={expandedArtist} key={`album-details ${expandedArtist.id}`} />
                    )}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ul>
      )}
      {/* pagination */}
      <div>
        <p>
          Showing {albumArtistsWithTracksOffset + 1}
          to {Math.min(albumArtistsWithTracksOffset + albumArtistsWithTracks.length, albumArtistsWithTracksTotal)}
          of {albumArtistsWithTracksTotal} albums
        </p>
      </div>
    </>
  );
}
