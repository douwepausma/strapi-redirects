import * as yup from 'yup';
import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { Form, useFetchClient } from '@strapi/admin/strapi-admin';
import { Modal, Button, Grid, Field, Checkbox, Box, Flex } from '@strapi/design-system';
import { Check } from '@strapi/icons';

import { RedirectModalProps } from '../utils/redirectPluginTypes';
import { getTranslation } from '../utils/getTranslation';
import { PLUGIN_ID } from '../pluginId';

const RedirectModal = ({
  visible,
  selectedRedirect = null,
  handleCloseModal,
  onRedirectSaved,
}: RedirectModalProps) => {
  const { formatMessage } = useIntl();
  const { post, put } = useFetchClient();

  const [source, setSource] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [permanent, setPermanent] = useState<boolean>(false);

  // State for tracking form errors
  const [formErrors, setFormErrors] = useState<{ source?: string; destination?: string }>({});

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPermanent(!permanent);
  };

  const handleSourceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSource(e.target.value);
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
  };

  // Validation schema for the form
  const validationSchema = yup.object().shape({
    source: yup.string().required('Source is required'),
    destination: yup.string().required('Destination is required'),
    permanent: yup.boolean(),
  });

  // Handle form submission (create or update)
  const handleSubmit = async (redirect: any) => {
    console.log(redirect);
    try {
      setFormErrors({}); // Clear previous errors

      // Include the 'permanent' field in the redirect object
      const payload = { ...redirect, permanent };

      if (selectedRedirect) {
        // Update existing redirect
        await put(`${PLUGIN_ID}/${selectedRedirect.documentId}`, payload);
      } else {
        // Create new redirect
        await post(`${PLUGIN_ID}`, payload);
      }

      handleCloseModal();
      onRedirectSaved(); // Trigger refetching of redirects
    } catch (error: any) {
      // Handle specific error responses
      const errorDetails = error?.response?.data?.error?.details;
      if (errorDetails?.type === 'DUPLICATE') {
        setFormErrors({ source: error.response.data.error.message });
      } else if (errorDetails?.type === 'LOOP') {
        setFormErrors({
          source: error.response.data.error.message,
          destination: error.response.data.error.message,
        });
      } else {
        setFormErrors({ source: 'An error occurred. Please try again.' });
      }
    }
  };

  useEffect(() => {
    if (selectedRedirect) {
      setSource(selectedRedirect.source || '');
      setDestination(selectedRedirect.destination || '');
      setPermanent(selectedRedirect.permanent || false);
    } else {
      setSource('');
      setDestination('');
      setPermanent(false);
    }
  }, [selectedRedirect]);

  return (
    <Modal.Root onOpenChange={handleCloseModal} open={visible} labelledBy="title">
      <Modal.Content>
        <Modal.Header>
          <Modal.Title id="title">
            {selectedRedirect
              ? formatMessage({
                  id: getTranslation('form.title.edit'),
                  defaultMessage: 'Edit a Redirect',
                })
              : formatMessage({
                  id: getTranslation('form.title.create'),
                  defaultMessage: 'Add a Redirect',
                })}
          </Modal.Title>
        </Modal.Header>
        <Form
          method={selectedRedirect ? 'PUT' : 'POST'}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          initialValues={{ source, destination, permanent }}
        >
          <Modal.Body>
            <Grid.Root gap={4}>
              <Grid.Item col={5}>
                <Box width="100%">
                  <Field.Root name="source" error={formErrors.source}>
                    <Field.Label>
                      {formatMessage({
                        id: getTranslation('form.field.source'),
                        defaultMessage: 'Source',
                      })}
                    </Field.Label>
                    <Field.Input type="text" value={source} onChange={handleSourceChange} />
                    <Field.Error />
                  </Field.Root>
                </Box>
              </Grid.Item>
              <Grid.Item col={5}>
                <Box width="100%">
                  <Field.Root name="destination" error={formErrors.destination}>
                    <Field.Label>
                      {formatMessage({
                        id: getTranslation('form.field.destination'),
                        defaultMessage: 'Destination',
                      })}
                    </Field.Label>
                    <Field.Input
                      type="text"
                      value={destination}
                      onChange={handleDestinationChange}
                    />
                    <Field.Error />
                  </Field.Root>
                </Box>
              </Grid.Item>
              <Grid.Item col={2}>
                <Box width="100%" height="100%">
                  <Flex alignItems="center" height="100%" paddingTop="16px">
                    <Checkbox
                      name="permanent"
                      checked={permanent}
                      onCheckedChange={handleCheckboxChange}
                    >
                      {formatMessage({
                        id: getTranslation('form.field.permanent'),
                        defaultMessage: 'Permanent',
                      })}
                    </Checkbox>
                  </Flex>
                </Box>
              </Grid.Item>
            </Grid.Root>
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button variant="tertiary" onClick={handleCloseModal}>
                {formatMessage({
                  id: getTranslation('form.cancel'),
                  defaultMessage: 'Cancel',
                })}
              </Button>
            </Modal.Close>

            <Button type="submit" startIcon={<Check />}>
              {formatMessage({ id: 'form.confirm', defaultMessage: 'Save' })}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Content>
    </Modal.Root>
  );
};

export { RedirectModal };
