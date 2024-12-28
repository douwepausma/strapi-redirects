import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DEFAULT_PAGE_SIZE = 10;

interface SearchQuery {
  pageSize: number;
  page: number;
  setNewPage: (newPage: number) => void;
  setNewPageSize: (newPageSize: number) => void;
}

const useSearchQuery = (): SearchQuery => {
  const { search, pathname } = useLocation();
  const navigate = useNavigate();

  // Using state to manage the pageSize independently
  const [pageSize, setPageSize] = useState<number>(() => {
    const searchParams = new URLSearchParams(search);
    return searchParams.get('pageSize') ? Number(searchParams.get('pageSize')) : DEFAULT_PAGE_SIZE;
  });

  const setNewPage = (newPage: number): void => {
    const searchParams = new URLSearchParams(search);
    searchParams.set('page', newPage.toString());

    // Persist existing parameters (like pageSize) and navigate
    navigate({
      pathname,
      search: '?' + searchParams.toString(),
    });
  };

  const setNewPageSize = (newPageSize: number): void => {
    setPageSize(newPageSize); // Update the local state for pageSize
    const searchParams = new URLSearchParams(search);
    searchParams.set('pageSize', newPageSize.toString());
    searchParams.set('page', '1'); // Reset to first page when page size changes

    // Persist other existing parameters and navigate
    navigate({
      pathname,
      search: '?' + searchParams.toString(),
    });
  };

  return useMemo((): SearchQuery => {
    const searchParams = new URLSearchParams(search);

    return {
      pageSize, // Using local state value here
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      setNewPage,
      setNewPageSize,
    };
  }, [search, pathname, pageSize, navigate]);
};

export { useSearchQuery };
