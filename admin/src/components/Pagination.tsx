import React from 'react';
import { useIntl } from 'react-intl';
import {
  Dots,
  NextLink,
  PageLink,
  Pagination as PaginationImpl,
  PreviousLink,
} from '@strapi/design-system';

interface PaginationProps {
  activePage: number;
  pageCount: number;
  handlePageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  activePage,
  pageCount,
  handlePageChange,
}) => {
  const { formatMessage } = useIntl();

  const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, i) => start + i);
  };

  const startPages = range(1, Math.min(1, pageCount));
  const endPages = range(Math.max(pageCount - 1, 2), pageCount);

  const siblingsStart = Math.max(Math.min(activePage - 1, pageCount - 2), 2);
  const siblingsEnd = Math.min(Math.max(activePage + 1, 2), pageCount - 1);

  const items = [
    ...startPages,
    ...(siblingsStart > 2 ? ['start-ellipsis'] : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < pageCount - 1 ? ['end-ellipsis'] : []),
    ...endPages,
  ];

  return (
    <PaginationImpl activePage={activePage} pageCount={pageCount}>
      <PreviousLink
        onClick={() => handlePageChange(activePage > 1 ? activePage - 1 : 1)}
        disabled={activePage === 1}
      >
        {formatMessage({
          id: 'components.pagination.go-to-previous',
          defaultMessage: 'Go to previous page',
        })}
      </PreviousLink>

      {items.map((item, index) => {
        if (typeof item === 'number') {
          return (
            <PageLink
              key={index}
              onClick={() => handlePageChange(item)}
              number={item}
              isActive={item === activePage}
            >
              {formatMessage(
                {
                  id: 'components.pagination.go-to',
                  defaultMessage: 'Go to page {page}',
                },
                { page: item }
              )}
            </PageLink>
          );
        }

        return <Dots key={index} />;
      })}

      <NextLink
        onClick={() => handlePageChange(activePage < pageCount ? activePage + 1 : pageCount)}
        disabled={activePage === pageCount}
      >
        {formatMessage({
          id: 'components.pagination.go-to-next',
          defaultMessage: 'Go to next page',
        })}
      </NextLink>
    </PaginationImpl>
  );
};

export default Pagination;
