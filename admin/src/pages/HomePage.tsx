import { useIntl } from 'react-intl';
import * as qs from 'qs';
import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { Layouts, useFetchClient, useNotification } from '@strapi/admin/strapi-admin';
import {
  Main,
  Flex,
  Box,
  Button,
  Typography,
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Checkbox,
  EmptyStateLayout,
  Loader,
  SearchForm,
  Searchbar,
} from '@strapi/design-system';
import { Pencil, Plus, Trash, ChevronUp, ChevronDown } from '@strapi/icons';

import { PLUGIN_ID } from '../pluginId';
import { RedirectType, PaginationType } from '../../../types/redirectPluginTypes';
import { getTranslation } from '../utils/getTranslation';
import { tableHeaders } from '../utils/tableHeaders';
import { redirectQuery } from '../utils/redirectQuery';
import { useSearchQuery } from '../hooks/useSearchQuery';

import { NoContentIcon } from '../components/NoContentIcon';
import { RedirectModal } from '../components/RedirectModal';
import Pagination from '../components/Pagination';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const { get, del } = useFetchClient();

  const { pageSize, page, setNewPage, setPageSize } = useSearchQuery();

  const [isFetching, setIsFetching] = useState(false);
  const [redirects, setRedirects] = useState<RedirectType[]>([]);
  const [pagination, setPagination] = useState<PaginationType>({
    page: 1,
    pageSize: 10,
    pageCount: 1,
    total: 0,
  });
  const [selectedRedirect, setSelectedRedirect] = useState<RedirectType | null>(null);
  const [sortBy, setSortBy] = useState<string>('permanent'); // Default sort field
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc'); // Default sort order
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Bulk delete state
  const [selectedRedirects, setSelectedRedirects] = useState<string[]>([]);

  const headers = tableHeaders(formatMessage);

  // Function to open the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal and refetch redirects
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRedirect(null);
    getRedirects(); // Refetch redirects on modal close
  };

  const handleEdit = (redirect: RedirectType) => {
    setSelectedRedirect(redirect);
    setIsModalOpen(true);
  };

  const handleDelete = async (documentId: string) => {
    try {
      await del(`${PLUGIN_ID}/${documentId}`);
      getRedirects(); // Refetch after delete
    } catch (error) {
      console.error('Error deleting redirect', error);
      toggleNotification({
        type: 'warning',
        message: `Error deleting redirect ${error}`,
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedRedirects.map((id) => del(`${PLUGIN_ID}/${id}`)));
      setSelectedRedirects([]);
      getRedirects(); // Refetch after deletion
    } catch (error) {
      console.error('Error deleting selected redirects', error);
      toggleNotification({
        type: 'warning',
        message: `Error deleting selected redirects ${error}`,
      });
    }
  };

  // Fetch redirects
  const getRedirects = async () => {
    try {
      setIsFetching(true);

      // Create query object and stringify it
      const queryObject = redirectQuery({
        sortBy,
        sortOrder,
        pageSize: Number(pageSize),
        page: Number(page),
        searchQuery,
      });

      const queryString = qs.stringify(queryObject, { encodeValuesOnly: true });

      const { data }: any = await get(`/${PLUGIN_ID}?${queryString}`);

      setRedirects(data.redirects);
      setPagination(data.meta.pagination);
    } catch (error) {
      console.error('Error fetching redirects:', error);
      setRedirects([]);
      setPagination({
        page: 1,
        pageSize: 10,
        pageCount: 1,
        total: 0,
      });
    } finally {
      setIsFetching(false);
    }
  };

  // Fetch redirects when the component mounts or when query parameters change
  useEffect(() => {
    getRedirects();
  }, [sortBy, sortOrder, pageSize, page, searchQuery]);

  useEffect(() => {
    setSearchQuery(debouncedSearchTerm);
    setNewPage(1); // Reset to first page on search
  }, [debouncedSearchTerm, setSearchQuery, setNewPage]);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortBy === field) {
      // Toggle sort order if sorting by the same field
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set a new sort field and default to ascending order
      setSortBy(field);
      setSortOrder('asc');
    }
    setNewPage(1); // Reset to the first page
  };

  // Handle pagination changes
  const handlePageChange = (newPage: number) => {
    setNewPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: string) => {
    setPageSize(Number(newPageSize));
    setNewPage(1); // Reset to first page when page size changes
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <Main>
      <Layouts.Header
        primaryAction={
          <Button variant="primary" startIcon={<Plus />} onClick={handleOpenModal}>
            {formatMessage({
              id: getTranslation('pages.homePage.header.button'),
              defaultMessage: 'Add a Redirect',
            })}
          </Button>
        }
        title={formatMessage({
          id: getTranslation('plugin.name'),
          defaultMessage: 'Redirects',
        })}
        subtitle={formatMessage(
          {
            id: getTranslation('pages.homePage.header.subtitle'),
            defaultMessage:
              '{number, plural, =0 {# entries} one {# entry} other {# entries}} found',
          },
          { number: pagination?.total }
        )}
      />
      <Layouts.Content>
        <Flex gap={4} direction="column" alignItems="stretch">
          {/* Search Input */}
          <Box paddingBottom={4}>
            <Flex gap={4} alignItems="center">
              <SearchForm>
                <Searchbar
                  name="searchbar"
                  onClear={() => setSearchTerm('')}
                  value={searchTerm}
                  onChange={handleSearchChange}
                  clearLabel={formatMessage({
                    id: 'pages.homePage.search.clearLabel',
                    defaultMessage: 'Clear redirects',
                  })}
                  placeholder={formatMessage({
                    id: 'pages.homePage.search.placeholder',
                    defaultMessage: 'Search redirects...',
                  })}
                >
                  {formatMessage({
                    id: 'pages.homePage.search.ariaLabel',
                    defaultMessage: 'Searching redirects',
                  })}
                </Searchbar>
              </SearchForm>

              {/* Bulk Delete Button */}
              {selectedRedirects.length > 0 && (
                <Button variant="danger" onClick={handleBulkDelete} endIcon={<Trash />}>
                  {formatMessage({
                    id: 'pages.homePage.bulkDelete',
                    defaultMessage: 'Delete Selected',
                  })}
                </Button>
              )}
            </Flex>
          </Box>

          {isFetching ? (
            <Flex padding={4} direction="column" justifyContent="center" alignItems="center">
              <Loader />
              <Typography marginLeft={2}>
                {formatMessage({ id: 'loading', defaultMessage: 'Loading...' })}
              </Typography>
            </Flex>
          ) : redirects.length > 0 ? (
            <>
              <Table>
                <Thead>
                  <Tr>
                    <Th>
                      <Checkbox
                        aria-label="Select all entries"
                        checked={
                          selectedRedirects.length === redirects.length
                            ? true
                            : selectedRedirects.length > 0 &&
                                selectedRedirects.length < redirects.length
                              ? 'indeterminate'
                              : false
                        }
                        onCheckedChange={(checked: any) => {
                          if (checked) {
                            // Select all redirects
                            setSelectedRedirects(redirects.map((redirect) => redirect.documentId));
                          } else {
                            // Deselect all redirects
                            setSelectedRedirects([]);
                          }
                        }}
                      />
                    </Th>
                    {headers.map((header, index) => (
                      <Th
                        key={header.key}
                        onClick={header.isSortable ? () => handleSort(header.key) : undefined}
                        style={{ cursor: header.isSortable ? 'pointer' : 'default' }}
                      >
                        <Flex
                          alignItems="center"
                          justifyContent={index === headers.length - 1 ? 'flex-end' : ''}
                          style={{ width: index === headers.length - 1 ? '100%' : 'auto'}}
                        >
                          <Typography variant="sigma">{header.label}</Typography>
                          {header.isSortable && (
                            <Box paddingLeft={1}>
                              {sortBy === header.key ? (
                                sortOrder === 'asc' ? (
                                  <ChevronUp aria-label="Sorted ascending" />
                                ) : (
                                  <ChevronDown aria-label="Sorted descending" />
                                )
                              ) : null}
                            </Box>
                          )}
                        </Flex>
                      </Th>
                    ))}
                  </Tr>
                </Thead>
                <Tbody>
                  {redirects.map((redirect: RedirectType) => (
                    <Tr key={redirect.id}>
                      <Td>
                        <Checkbox
                          aria-label={`Select entry ${redirect.id}`}
                          checked={selectedRedirects.includes(redirect.documentId)}
                          onCheckedChange={(checked: any) => {
                            if (checked) {
                              // Add the selected redirect to the list
                              setSelectedRedirects([...selectedRedirects, redirect.documentId]);
                            } else {
                              // Remove the deselected redirect from the list
                              setSelectedRedirects(
                                selectedRedirects.filter((id) => id !== redirect.documentId)
                              );
                            }
                          }}
                        />
                      </Td>
                      <Td>
                        <Typography>{redirect.source}</Typography>
                      </Td>
                      <Td>
                        <Typography>{redirect.destination}</Typography>
                      </Td>
                      <Td>
                        <Typography>{redirect.permanent ? 'Yes' : 'No'}</Typography>
                      </Td>
                      <Td>
                        <Flex gap={2} justifyContent="flex-end">
                          <Button
                            variant="secondary"
                            onClick={() => handleEdit(redirect)}
                            endIcon={<Pencil />}
                          >
                            {formatMessage({
                              id: getTranslation('pages.homePage.table.edit'),
                              defaultMessage: 'Edit',
                            })}
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(redirect.documentId)}
                            endIcon={<Trash />}
                          >
                            {formatMessage({
                              id: getTranslation('pages.homePage.table.delete'),
                              defaultMessage: 'Delete',
                            })}
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              {/* Pagination */}
              <Box paddingTop={4}>
                {pagination && (
                  <Pagination
                    activePage={pagination.page}
                    pageCount={pagination.pageCount}
                    query={redirectQuery({ sortBy, sortOrder, pageSize, page, searchQuery })}
                  />
                )}
              </Box>
            </>
          ) : (
            <Box background="neutral100">
              <EmptyStateLayout
                icon={<NoContentIcon />}
                content={formatMessage({
                  id: getTranslation('overview.table.body.empty.content'),
                  defaultMessage: "You don't have any redirects yet...",
                })}
                action={
                  <Button variant="secondary" startIcon={<Plus />} onClick={handleOpenModal}>
                    {formatMessage({
                      id: getTranslation('overview.table.body.empty.button'),
                      defaultMessage: 'Create your first Redirect',
                    })}
                  </Button>
                }
              />
            </Box>
          )}
        </Flex>
      </Layouts.Content>

      {/* Redirect Modal */}
      <RedirectModal
        visible={isModalOpen}
        selectedRedirect={selectedRedirect}
        handleCloseModal={handleCloseModal}
        onRedirectSaved={getRedirects}
      />
    </Main>
  );
};

export { HomePage };
