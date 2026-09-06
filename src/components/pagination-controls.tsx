import { Fragment } from 'react/jsx-runtime';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './ui/pagination';
import { useMemo } from 'react';
import { usePreferences } from '@/hooks/use-preferences';

export function PaginationControls({
  page,
  items,
  setPage,
}: {
  page: number;
  items: number;
  setPage: (nextPage: number) => void;
}) {
  const { preferences } = usePreferences();
  const { pageSize } = preferences;

  const pageNumbers = useMemo(() => {
    const pageCount = Math.ceil(items / pageSize);
    const pages = new Set<number>([1, page, page - 1, page + 1, pageCount]);
    return [...pages].filter((pageNumber) => pageNumber >= 1 && pageNumber <= pageCount).sort((a, b) => a - b);
  }, [page, pageSize, items]);

  const goToPage = (nextPage: number) => {
    setPage(Math.min(Math.max(nextPage, 1), Math.ceil(items / pageSize)));
  };

  if (pageNumbers.length === 1) return <div className="m-4"></div>;

  return (
    <div className="my-10">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1}
              className={page === 1 ? 'pointer-events-none opacity-50' : undefined}
              onClick={(event) => {
                event.preventDefault();
                goToPage(page - 1);
              }}
            />
          </PaginationItem>
          {pageNumbers.map((pageNumber, index) => {
            const previousPage = pageNumbers[index - 1];
            return (
              <Fragment key={pageNumber}>
                {previousPage && pageNumber - previousPage > 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationLink
                    href="#"
                    isActive={pageNumber === page}
                    onClick={(event) => {
                      event.preventDefault();
                      goToPage(pageNumber);
                    }}
                  >
                    {pageNumber}
                  </PaginationLink>
                </PaginationItem>
              </Fragment>
            );
          })}
          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === Math.ceil(items / pageSize)}
              className={page === Math.ceil(items / pageSize) ? 'pointer-events-none opacity-50' : undefined}
              onClick={(event) => {
                event.preventDefault();
                goToPage(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
