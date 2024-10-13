// hooks/useSearchQuery.ts
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DEFAULT_PAGE_SIZE = 10;

interface SearchQuery {
  pageSize: number;
  page: number;
  setNewPage: (newPage: number) => void;
  setPageSize: (newPageSize: number) => void;
}

const useSearchQuery = (): SearchQuery => {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  const setNewPage = (newPage: number): void => {
    const searchParams = new URLSearchParams(search);
    searchParams.set('page', newPage.toString());

    navigate({
      pathname,
      search: '?' + searchParams.toString(),
    });
  };

  const setPageSize = (newPageSize: number): void => {
    const searchParams = new URLSearchParams(search);
    searchParams.set('pageSize', newPageSize.toString());
    searchParams.set('page', '1'); // Reset to first page when page size changes

    navigate({
      pathname,
      search: '?' + searchParams.toString(),
    });
  };

  return useMemo((): SearchQuery => {
    const searchParams = new URLSearchParams(search);

    return {
      pageSize: searchParams.get('pageSize')
        ? Number(searchParams.get('pageSize'))
        : DEFAULT_PAGE_SIZE,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      setNewPage,
      setPageSize,
    };
  }, [search, pathname, navigate]);
};

export { useSearchQuery };
