import { AlbumCard } from '@/components/album-card';
import { AlbumExpandedDetails } from '@/components/album-expanded-details';
import { AlbumListItem } from '@/components/album-list-item';
import { AlbumSortFieldEnum, SortDirectionEnum } from '@/types/api-schema';
import { AlbumStandaloneDetails } from '@/components/album-standalone-details';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useLibrary } from '@/hooks/user/use-library';
import { useNavigate, useParams } from 'react-router-dom';

export default function AlbumsList() {
  const navigate = useNavigate();
  const {
    listAlbumsWithTracks,
    albumsWithTracks,
    albumsWithTracksTotal,
    albumsWithTracksOffset,
    albumsWithTracksLoading,
    albumsWithTracksError,
  } = useLibrary();
  const isMobile = useIsMobile();
  const [columnSize, setColumnSize] = useState(0);
  const listRef = useRef(null);
  const { albumId } = useParams<{ albumId: string }>();
  const expandedAlbumId = albumId ? Number(albumId) : null;
  const expandedAlbum =
    expandedAlbumId !== null ? (albumsWithTracks.find((album) => album.id === expandedAlbumId) ?? null) : null;

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
  }, [albumsWithTracks.length]);

  function formatSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFC')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\p{L}\p{N}-]+/gu, '')
      .replace(/-+/g, '-');
  }

  function toggleAlbum(id: number) {
    if (expandedAlbumId === id) {
      navigate('/albums');
    } else {
      const album = albumsWithTracks.find((item) => item.id === id);
      if (!album) {
        // eslint-disable-next-line no-console
        console.error(`Album with id ${id} not found`);
        return;
      }
      navigate(`/albums/${id}/${formatSlug(album.displayName)}-${formatSlug(album.albumArtists.join(','))}`);
    }
  }

  const clickedAlbumIndex = albumsWithTracks.findIndex((item) => item.id === expandedAlbumId);
  const detailsInsertIndex =
    clickedAlbumIndex >= 0 ? Math.ceil((clickedAlbumIndex + 1) / columnSize) * columnSize - 1 : -1;
  const insertingAlbum = albumsWithTracks[clickedAlbumIndex];

  useEffect(() => {
    listAlbumsWithTracks({
      sortField: AlbumSortFieldEnum.album,
      sortDirection: SortDirectionEnum.asc,
    });
  }, [listAlbumsWithTracks]);

  return (
    <>
      <title>Albums // SHM</title>
      {albumsWithTracksLoading && <p>Loading...</p>}
      {albumsWithTracksError && <p>Error: {albumsWithTracksError.message}</p>}
      {isMobile && (
        <ul className="flex flex-col grow">
          {insertingAlbum && (
            <li
              className="album-details col-span-full flex flex-col grow  -mx-4"
              key={`mobile-expanding-album-details ${insertingAlbum}`}
            >
              {expandedAlbum && (
                <AlbumStandaloneDetails
                  album={expandedAlbum}
                  key={`mobile-album-details ${expandedAlbum.id}`}
                  onClose={() => toggleAlbum(expandedAlbum.id)}
                />
              )}
            </li>
          )}
          {!insertingAlbum &&
            albumsWithTracks.map((item) => {
              return (
                <li className="w-full p-2" key={`mobile-album ${item.id}`}>
                  <AlbumListItem
                    album={item}
                    isExpanded={expandedAlbumId === item.id}
                    onToggle={() => toggleAlbum(item.id)}
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
          {albumsWithTracks.map((item, index) => {
            const isExpanded = expandedAlbumId === item.id;
            const shouldInsertDetails = detailsInsertIndex === index;
            return (
              <Fragment key={item.id}>
                <li className="w-full h-full inline-block" key={`album ${item.id}`}>
                  <AlbumCard
                    key={`album-card ${item.id}`}
                    album={item}
                    isExpanded={isExpanded}
                    onToggle={() => toggleAlbum(item.id)}
                  />
                </li>
                {shouldInsertDetails && (
                  <li
                    className="album-details col-span-full -mx-4"
                    key={`expanding-album-details ${insertingAlbum.id}`}
                  >
                    {expandedAlbum && (
                      <AlbumExpandedDetails album={expandedAlbum} key={`album-details ${expandedAlbum.id}`} />
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
          Showing {albumsWithTracksOffset + 1}
          to {Math.min(albumsWithTracksOffset + albumsWithTracks.length, albumsWithTracksTotal)}
          of {albumsWithTracksTotal} albums
        </p>
      </div>
    </>
  );
}
