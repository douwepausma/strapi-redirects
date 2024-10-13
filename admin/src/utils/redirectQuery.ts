// redirectQuery.ts
interface QueryParams {
  sortBy: string;
  sortOrder: string;
  pageSize: number;
  page: number;
  searchQuery: string;
}

const redirectQuery = ({
  sortBy,
  sortOrder,
  pageSize,
  page,
  searchQuery,
}: QueryParams): Record<string, any> => {
  const baseQuery: Record<string, any> = {
    sort: [`${sortBy}:${sortOrder}`],
    pagination: {
      pageSize,
      page,
    },
  };

  // Add search filters if a search query exists
  if (searchQuery.trim() !== '') {
    baseQuery.filters = {
      $or: [
        {
          source: { $containsi: searchQuery },
        },
        {
          destination: { $containsi: searchQuery },
        },
      ],
    };
  }

  return baseQuery;
};

export { redirectQuery };
