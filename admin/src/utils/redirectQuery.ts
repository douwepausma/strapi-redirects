import * as qs from 'qs';

interface QueryParams {
  sortBy: string;
  sortOrder: string;
  pageSize: number;
  page: number;
  searchQuery: string;
}

const redirectQuery = ({ sortBy, sortOrder, pageSize, page, searchQuery }: QueryParams): string => {
  const query = qs.stringify(
    {
      sort: [`${sortBy}:${sortOrder}`],
      pagination: {
        pageSize,
        page,
      },
      filters: {
        $or: [
          {
            source: { $contains: searchQuery },
          },
          {
            destination: { $contains: searchQuery },
          },
        ],
      },
    },
    { encodeValuesOnly: true }
  );

  return query;
};

export { redirectQuery };
