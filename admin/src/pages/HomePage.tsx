import { useIntl } from 'react-intl';
import { useState, useEffect } from 'react';
import { Layouts, useFetchClient } from '@strapi/admin/strapi-admin';
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
} from '@strapi/design-system';
import { Pencil, Plus, Trash } from '@strapi/icons';

import { PLUGIN_ID } from '../pluginId';
import { Redirect } from '../utils/redirectPluginTypes';
import { getTranslation } from '../utils/getTranslation';
import { tableHeaders } from '../utils/tableHeaders';
import { redirectQuery } from '../utils/redirectQuery';

import { NoContentIcon } from '../components/NoContentIcon';
import { RedirectModal } from '../components/RedirectModal';
import { useSearchQuery } from '../hooks/useSearchQuery';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { get, del } = useFetchClient();

  const [isFetching, setIsFetching] = useState(false);
  const [redirects, setRedirects] = useState<Redirect[]>([]);
  const [selectedRedirect, setSelectedRedirect] = useState<Redirect | null>(null);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const { pageSize, page, setNewPage } = useSearchQuery();

  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleEdit = (redirect: Redirect) => {
    setSelectedRedirect(redirect);
    setIsModalOpen(true);
  };

  const handleDelete = async (documentId: string) => {
    try {
      await del(`${PLUGIN_ID}/${documentId}`);
      getRedirects(); // Refetch after delete
    } catch (error) {
      console.error('Error deleting redirect', error);
    }
  };

  // Fetch redirects
  const getRedirects = async () => {
    try {
      setIsFetching(true);
      const query = redirectQuery({ sortBy, sortOrder, pageSize, page, searchQuery });
      const { data } = await get(`/${PLUGIN_ID}?${query}`);
      setRedirects(data.redirects);
    } catch (error) {
      setRedirects([]);
    } finally {
      setIsFetching(false);
    }
  };

  // Fetch redirects when the component mounts or search/query parameters change
  useEffect(() => {
    getRedirects();
  }, [sortBy, sortOrder, pageSize, page, searchQuery]);

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
        subtitle={formatMessage({
          id: getTranslation('pages.homePage.header.subtitle'),
          defaultMessage: '(WIP) Show number of redirects here',
        })}
      />
      <Layouts.Action />
      <Layouts.Content>
        <Flex gap={4} direction="column" alignItems="stretch">
          {isFetching ? (
            <Box padding={4}>
              <Typography>
                {formatMessage({ id: 'loading', defaultMessage: 'Loading...' })}
              </Typography>
            </Box>
          ) : redirects.length > 0 ? (
            <Table>
              <Thead>
                <Tr>
                  <Th>
                    <Checkbox aria-label="Select all entries" />
                  </Th>
                  {headers.map((header, index) => (
                    <Th key={header.key}>
                      <Flex
                        justifyContent="flex-end"
                        width={headers.length - 1 === index ? '100%' : 'auto'}
                      >
                        <Typography variant="sigma">{header.label}</Typography>
                      </Flex>
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                {redirects.map((redirect: Redirect) => (
                  <Tr key={redirect.id}>
                    <Td>
                      <Checkbox aria-label={`Select entry ${redirect.id}`} />
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
                            id: 'pages.homePage.table.edit',
                            defaultMessage: 'Edit',
                          })}
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(redirect.documentId)}
                          endIcon={<Trash />}
                        >
                          {formatMessage({
                            id: 'pages.homePage.table.delete',
                            defaultMessage: 'Delete',
                          })}
                        </Button>
                      </Flex>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
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
