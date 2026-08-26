import { AlbumCard } from '@/components/album-card';
import { AlbumDetails } from '@/components/album-details';
import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { useLibrary, type AlbumWithTracksDto } from '@/hooks/user/use-library';

const Home = () => {
  const {
    albumsWithTracks,
    albumsWithTracksTotal,
    albumsWithTracksOffset,
    albumsWithTracksLoading,
    albumsWithTracksError,
  } = useLibrary();
  const [expandedAlbumId, setExpandedAlbumId] = useState<number | null>(null);
  const [expandedAlbum, setExpandedAlbum] = useState<AlbumWithTracksDto | null>(null);
  const listRef = useRef(null);
  const [columnSize, setColumnSize] = useState(0);

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
      };
    }
    return undefined;
  }, [albumsWithTracks.length]);

  function toggleAlbum(albumId: number) {
    setExpandedAlbumId((currentId) => (currentId === albumId ? null : albumId));
    const album = albumsWithTracks.find((item) => item.id === albumId) || null;
    setExpandedAlbum(album);
  }

  const clickedAlbumIndex = albumsWithTracks.findIndex((item) => item.id === expandedAlbumId);
  const detailsInsertIndex =
    clickedAlbumIndex >= 0 ? Math.ceil((clickedAlbumIndex + 1) / columnSize) * columnSize - 1 : -1;

  return (
    <>
      <title>Music Player // SHM</title>
      {albumsWithTracksLoading && <p>Loading...</p>}
      {albumsWithTracksError && <p>Error: {albumsWithTracksError.message}</p>}
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
              <li className={['w-full h-full', 'inline-block'].join(' ')} key={`album ${item.id}`}>
                <AlbumCard key={item.id} album={item} isExpanded={isExpanded} onToggle={() => toggleAlbum(item.id)} />
              </li>
              {shouldInsertDetails && (
                <li className="album-details col-span-full -mx-4" key={`album-details ${item.id}`}>
                  {expandedAlbum && <AlbumDetails album={expandedAlbum} />}
                </li>
              )}
            </Fragment>
          );
        })}
      </ul>
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
};

export default Home;
