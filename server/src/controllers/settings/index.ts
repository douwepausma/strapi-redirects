import type { Core } from '@strapi/types';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getContentTypes(ctx) {
    try {
      const contentTypes = await strapi
        .plugin('redirects')
        .service('settingsService')
        .getContentTypes();
      ctx.body = contentTypes;
    } catch (error) {
      strapi.log.error('Error fetching content types:', error);
      ctx.internalServerError('Failed to fetch content types');
    }
  },

  async getSettings(ctx) {
    try {
      const settings = await strapi.plugin('redirects').service('settingsService').getSettings();
      ctx.body = settings;
    } catch (error) {
      strapi.log.error('Error fetching settings:', error);
      ctx.internalServerError('Failed to fetch settings.');
    }
  },

  async updateSettings(ctx) {
    try {
      const { uid, ...changes } = ctx.request.body;

      if (!uid) {
        return ctx.badRequest('UID is required');
      }

      const updated = await strapi
        .plugin('redirects')
        .service('settingsService')
        .updateSetting(uid, changes);

      ctx.body = updated;
    } catch (error) {
      strapi.log.error('Error updating settings:', error);
      ctx.internalServerError('Failed to update settings.');
    }
  },
});
