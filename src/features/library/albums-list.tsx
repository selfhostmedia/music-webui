import { AlbumCard } from '@/components/album-card';
import { AlbumExpandedDetails } from '@/components/album-expanded-details';
import { AlbumListItem } from '@/components/album-list-item';
import { AlbumStandaloneDetails } from '@/components/album-standalone-details';
import { Fragment, useLayoutEffect, useRef, useState } from 'react';
import { formatSlug } from '@/utils/format';
import { useAlbumsWithTracks } from '@/hooks/user/use-albums';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useNavigate, useParams } from 'react-router-dom';

type QueryParameters = NonNullable<Parameters<typeof useAlbumsWithTracks>[0]>;

const errorMessages: Record<string, string> = {
  'invalid-added-after-error': 'The added-after date is invalid',
  'invalid-added-before-error': 'The added-before date is invalid',
  'invalid-artist-error': 'The artist is invalid',
  'invalid-artist-length-error': 'The artist length is invalid',
  'invalid-composer-error': 'The composer is invalid',
  'invalid-composer-length-error': 'The composer length is invalid',
  'invalid-filter-error': 'The filter is invalid',
  'invalid-filter-length-error': 'The filter length is invalid',
  'invalid-genre-error': 'The genre is invalid',
  'invalid-genre-length-error': 'The genre length is invalid',
  'invalid-limit-error': 'The limit is invalid',
  'invalid-limit-range-error': 'The limit is out of range',
  'invalid-max-rating-error': 'The maximum rating is invalid',
  'invalid-min-rating-error': 'The minimum rating is invalid',
  'invalid-offset-error': 'The offset is invalid',
  'invalid-offset-range-error': 'The offset is out of range',
  'invalid-released-after-error': 'The released-after date is invalid',
  'invalid-released-before-error': 'The released-before date is invalid',
  'invalid-sort-field-error': 'The sort field is invalid',
  'invalid-sort-order-error': 'The sort order is invalid',
  'invalid-year-error': 'The year is invalid',
};

export default function AlbumsList() {
  const navigate = useNavigate();
  const [query] = useState<QueryParameters>({
    offset: 0,
    limit: 100_000,
  });
  const { data, isPending, error } = useAlbumsWithTracks(query);
  const isMobile = useIsMobile();
  const [columnSize, setColumnSize] = useState(0);
  const listRef = useRef(null);
  const { albumId } = useParams<{ albumId: string }>();
  const expandedAlbumId = albumId ? Number(albumId) : null;
  const expandedAlbum =
    expandedAlbumId !== null ? (data?.albums.find((album) => album.id === expandedAlbumId) ?? null) : null;

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
  }, [data?.albums.length]);

  function toggleAlbum(id: number) {
    if (expandedAlbumId === id) {
      navigate('/albums');
    } else {
      const album = data?.albums.find((item) => item.id === id);
      if (!album) {
        // eslint-disable-next-line no-console
        console.error(`Album with id ${id} not found`);
        return;
      }
      navigate(`/albums/${id}/${formatSlug(album.displayName)}-${formatSlug(album.albumArtists.join(','))}`);
    }
  }

  function getErrorMessages() {
    if (!error) {
      return [];
    }
    const messages: string[] = [];
    for (let i = 0; i < error.messages.length; i += 1) {
      const message = error.messages[i];
      messages.push(errorMessages[message] ?? message);
    }
    return messages;
  }

  const clickedAlbumIndex = data?.albums.findIndex((item) => item.id === expandedAlbumId) ?? -1;
  let detailsInsertIndex =
    clickedAlbumIndex >= 0 ? Math.ceil((clickedAlbumIndex + 1) / columnSize) * columnSize - 1 : -1;
  if (data?.albums.length) {
    if (detailsInsertIndex > data.albums.length) {
      detailsInsertIndex = data.albums.length - 1;
    }
  }
  const insertingAlbum = data?.albums[clickedAlbumIndex];

  return (
    <>
      <title>Albums // SHM</title>
      {isPending && <p>Loading...</p>}
      {error && (
        <ul>
          {getErrorMessages()?.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      )}
      {isMobile && (
        <ul className="flex flex-col grow">
          {insertingAlbum && (
            <li
              className="album-details col-span-full flex flex-col grow  -mx-4"
              key={`mobile-expanding-album-details ${insertingAlbum.id}`}
            >
              {expandedAlbum && (
                <AlbumStandaloneDetails album={expandedAlbum} onClose={() => toggleAlbum(expandedAlbum.id)} />
              )}
            </li>
          )}
          {!insertingAlbum &&
            data?.albums.map((item) => {
              return (
                <li className="w-full p-2" key={`mobile-album ${item.id}`}>
                  <AlbumListItem
                    album={item}
                    isExpanded={expandedAlbumId === item.id}
                    onToggle={() => toggleAlbum(item.id)}
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
          {data?.albums.map((item, index) => {
            const isExpanded = expandedAlbumId === item.id;
            const shouldInsertDetails = detailsInsertIndex === index;
            return (
              <Fragment key={`album ${item.id}`}>
                <li className="w-full h-full inline-block">
                  <AlbumCard album={item} isExpanded={isExpanded} onToggle={() => toggleAlbum(item.id)} />
                </li>
                {shouldInsertDetails && (
                  <li className="album-details col-span-full -mx-4">
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
    </>
  );
}
