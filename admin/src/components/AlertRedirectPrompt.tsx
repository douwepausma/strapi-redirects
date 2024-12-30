import React, { useEffect, useState } from 'react';
import {
  useFetchClient,
  unstable_useContentManagerContext as useContentManagerContext,
} from '@strapi/strapi/admin';
import { LifecycleSetting, RedirectType } from '../../../types/redirectPluginTypes';
import { Box, Button, Typography, Flex } from '@strapi/design-system';
import { RedirectModal } from './RedirectModal';
import { PLUGIN_ID } from '../pluginId';

const RedirectAlert: React.FC = () => {
  const { form, model } = useContentManagerContext();
  const { initialValues, values } = form;

  const { get } = useFetchClient();

  const [settings, setSettings] = useState<LifecycleSetting[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [redirectData, setRedirectData] = useState<RedirectType | null>(null);

  // Fetch lifecycle settings
  const fetchSettings = async () => {
    try {
      const res = await get<{ data: LifecycleSetting[] }>(`/${PLUGIN_ID}/settings`);
      const settingsArray = Array.isArray(res.data) ? res.data : [];
      setSettings(settingsArray);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    const modelUID = model; // Assuming `model` is a string representing the UID
    const modelSettings = settings.find((s) => s.uid === modelUID);

    if (modelSettings?.enabled) {
      const trackedField = modelSettings.field;

      if (trackedField && initialValues?.[trackedField] !== values?.[trackedField]) {
        setRedirectData({
          source: `/${initialValues[trackedField]}` || '',
          destination: `/${values[trackedField]}` || '',
          permanent: true, // Default value
        });
      } else {
        setRedirectData(null);
      }
    }
  }, [values, initialValues, settings, model]);

  const handleModalClose = () => setModalVisible(false);

  if (!redirectData) return null;

  return (
    <Box padding={4} background="neutral100" shadow="tableShadow">
      <Box marginBottom={2}>
        <Typography variant="omega">
          The field <strong>{settings.find((s) => s.uid === model)?.field || 'UID'}</strong> has
          changed. Would you like to create a redirect?
        </Typography>
      </Box>
      <Button onClick={() => setModalVisible(true)} variant="secondary" size="S">
        Create Redirect
      </Button>

      {modalVisible && (
        <RedirectModal
          visible={modalVisible}
          selectedRedirect={redirectData}
          handleCloseRedirectModal={handleModalClose}
          onRedirectSaved={() => {
            setRedirectData(null); // Clear the alert after the redirect is saved
            setModalVisible(false);
          }}
        />
      )}
    </Box>
  );
};

export default RedirectAlert;
