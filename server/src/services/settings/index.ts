import type { Core } from '@strapi/types';
import { ContentType, LifecycleSetting } from '../../../../types/redirectPluginTypes';

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const STORE_KEY = 'lifecycle-settings';
  const pluginStore = strapi.store({
    type: 'plugin',
    name: 'redirects',
  });

  return {
    async getSettings() {
      try {
        const settings = await pluginStore.get({ key: STORE_KEY });
        // Ensure settings is an array
        return Array.isArray(settings)
          ? settings
          : Object.entries(settings || {}).map(([uid, value]) => ({ uid, ...value }));
      } catch (error) {
        strapi.log.error('Error fetching settings:', error);
        return [];
      }
    },

    async updateSetting(uid: string, changes: Partial<LifecycleSetting>) {
      try {
        const settings = await this.getSettings();
        const index = settings.findIndex((item) => item.uid === uid);
    
        if (index !== -1) {
          // Update the existing setting
          settings[index] = { ...settings[index], ...changes };
        } else {
          // Add a new setting
          settings.push({ uid, enabled: false, field: '', ...changes });
        }
    
        // Save the updated settings array
        await pluginStore.set({ key: STORE_KEY, value: settings });
        return settings;
      } catch (error) {
        strapi.log.error('Error updating setting:', error);
        throw new Error('Failed to update setting');
      }
    },

    async getContentTypes() {
      const FIELD_TYPES = ['string', 'uid'];
      const result: ContentType[] = [];
      
      Object.entries(strapi.contentTypes).forEach(([uid, contentType]) => {
        if (!uid.startsWith('api::')) return;

        const fields = Object.entries(contentType.attributes)
          .filter(([_, attr]: [string, any]) => FIELD_TYPES.includes(attr.type))
          .map(([name]) => ({ name }));

        if (fields.length > 0) {
          result.push({
            uid,
            info: contentType.info,
            fields,
          });
        }
      });

      return result;
    },
  };
};
