import { Fragment, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { GenreCard } from '@/components/genre-card';
import { GenreExpandedDetails } from '@/components/genre-expanded-details';
import { GenreListItem } from '@/components/genre-list-item';
import { GenreStandaloneDetails } from '@/components/genre-standalone-details';
import { PaginationControls } from '@/components/pagination-controls';
import { formatSlug } from '@/utils/format';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { useLibrary } from './library';
import { useNavigate, useParams } from 'react-router-dom';
import { usePreferences } from '@/hooks/use-preferences';

export default function TrackGenresList() {
  const navigate = useNavigate();
  const { genres } = useLibrary();
  const isMobile = useIsMobile();
  const [columnSize, setColumnSize] = useState(0);
  const { preferences } = usePreferences();
  const { pageSize } = preferences;
  const [page, setPage] = useState(1);
  const listRef = useRef(null);
  const { genreId } = useParams<{ genreId: string }>();
  const expandedGenreId = genreId ? Number(genreId) : null;
  const expandedGenre =
    expandedGenreId !== null ? (genres.find((genre) => genre.id === expandedGenreId) ?? null) : null;

  useLayoutEffect(() => {
    const list = listRef.current as HTMLElement | null;
    if (list) {
      const measureColumns = () => {
        const items = Array.from(list.querySelectorAll<HTMLElement>('li')) as HTMLElement[];
        if (items.length > 0) {
          const firstItem = items[0];
          let interruptedByExpandedGenre = -1;
          for (let i = 1; i < items.length; i += 1) {
            const item = items[i];
            if (item.classList.contains('genre-details')) {
              interruptedByExpandedGenre = i;
              break;
            }
            if (item.offsetTop > firstItem.offsetTop) {
              setColumnSize(i);
              break;
            }
          }
          // find the first row-starting element after the expanded album details
          if (interruptedByExpandedGenre > -1) {
            let newFirstItem = -1;
            for (let i = interruptedByExpandedGenre + 1; i < items.length; i += 1) {
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
  }, [genres.length]);

  function toggleGenre(id: number) {
    if (expandedGenreId === id) {
      navigate('/track-genres');
    } else {
      const genre = genres.find((item) => item.id === id);
      if (!genre) {
        // eslint-disable-next-line no-console
        console.error(`Genre with id ${id} not found`);
        return;
      }
      navigate(`/track-genres/${id}/${formatSlug(genre.name)}`);
    }
  }

  const visibleData = useMemo(() => {
    if (pageSize) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return genres.slice(start, end) || [];
    }
    return genres;
  }, [genres, page, pageSize]);

  const clickedGenreIndex = visibleData.findIndex((item) => item.id === expandedGenreId) ?? -1;
  const insertingGenre = visibleData[clickedGenreIndex];
  let detailsInsertIndex =
    clickedGenreIndex >= 0 ? Math.ceil((clickedGenreIndex + 1) / columnSize) * columnSize - 1 : -1;
  if (visibleData.length) {
    if (detailsInsertIndex > visibleData.length) {
      detailsInsertIndex = visibleData.length - 1;
    }
  }

  return (
    <>
      <title>Track Genres // SHM</title>
      {isMobile && (
        <ul className="flex flex-col grow">
          {insertingGenre && (
            <li className="genre-details col-span-full flex flex-col grow  -mx-4">
              {expandedGenre && (
                <GenreStandaloneDetails genre={expandedGenre} onClose={() => toggleGenre(expandedGenre.id)} />
              )}
            </li>
          )}
          {!insertingGenre &&
            visibleData.map((item) => {
              return (
                <li className="w-full p-2" key={`mobile-genre ${item.id}`}>
                  <GenreListItem
                    genre={item}
                    isExpanded={expandedGenreId === item.id}
                    onToggle={() => toggleGenre(item.id)}
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
          {visibleData.map((item, index) => {
            const isExpanded = expandedGenreId === item.id;
            const shouldInsertDetails = detailsInsertIndex === index;
            return (
              <Fragment key={`track-genre ${item.id}`}>
                <li className="w-full h-full inline-flex align-middle justify-center">
                  <GenreCard genre={item} isExpanded={isExpanded} onToggle={() => toggleGenre(item.id)} />
                </li>
                {shouldInsertDetails && (
                  <li className="genre-details col-span-full -mx-4">
                    {expandedGenre && <GenreExpandedDetails genre={expandedGenre} />}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ul>
      )}
      <PaginationControls page={page} setPage={setPage} items={genres?.length ?? 0} />
    </>
  );
}
