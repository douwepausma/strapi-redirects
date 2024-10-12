import type { Core } from '@strapi/types';
import { validateRedirect } from '../helpers/redirectValidationHelper';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Handle response errors in a centralized way.
   */
  handleError(ctx, error, message = 'An error occurred') {
    console.error(message, error);
    return ctx.internalServerError(message);
  },

  /**
   * Get settings
   */
  async getSettings(ctx) {
    try {
      const items = await strapi.plugin('strapi-redirects').service('settingService').getList();
      ctx.body = { items };
    } catch (error) {
      this.handleError(ctx, error, 'Failed to fetch settings.');
    }
  },

  /**
   * Find one redirect
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    try {
      const redirect = await strapi
        .plugin('strapi-redirects')
        .service('redirectService')
        .findOne(id);
      if (!redirect) return ctx.notFound('Redirect not found.');
      ctx.body = redirect;
    } catch (error) {
      this.handleError(ctx, error, 'Failed to fetch redirect.');
    }
  },

  /**
   * Find all redirects
   */
  async findAll(ctx) {
    try {
      const params = ctx.query;
      const result = await strapi
        .plugin('strapi-redirects')
        .service('redirectService')
        .findAll(params);
      ctx.body = result;
    } catch (error) {
      this.handleError(ctx, error, 'Failed to fetch redirects.');
    }
  },

  /**
   * Create a redirect
   */
  async create(ctx) {
    try {
      const validity = await validateRedirect(ctx.request.body);
      if (!validity.ok) {
        return ctx.badRequest(validity.errorMessage, validity.details);
      }

      const redirect = await strapi
        .plugin('strapi-redirects')
        .service('redirectService')
        .create(ctx.request.body);
      ctx.body = redirect;
    } catch (error) {
      this.handleError(ctx, error, 'Failed to create redirect.');
    }
  },
  /**
   * Update a redirect
   */
  async update(ctx) {
    const { id } = ctx.params;
    try {
      const validity = await validateRedirect(ctx.request.body, id);
      if (!validity.ok) {
        return ctx.badRequest(validity.errorMessage, validity.details);
      }

      const redirect = await strapi
        .plugin('strapi-redirects')
        .service('redirectService')
        .update(id, ctx.request.body);
      if (!redirect) return ctx.notFound('Redirect not found.');
      ctx.body = redirect;
    } catch (error) {
      this.handleError(ctx, error, 'Failed to update redirect.');
    }
  },

  /**
   * Delete a redirect
   */
  async delete(ctx) {
    const { documentId } = ctx.params;
    try {
      const redirect = await strapi
        .plugin('strapi-redirects')
        .service('redirectService')
        .delete(documentId);
      if (!redirect) return ctx.notFound('Redirect not found.');
      ctx.body = redirect;
    } catch (error) {
      this.handleError(ctx, error, 'Failed to delete redirect.');
    }
  },

  /**
   * Import redirects
   */
  async import(ctx) {
    try {
      const data = ctx.request.body;
      if (!Array.isArray(data)) return ctx.badRequest('Invalid data provided for import.');
      const results = await strapi
        .plugin('strapi-redirects')
        .service('redirectService')
        .import(data);
      ctx.body = results;
    } catch (error) {
      this.handleError(ctx, error, 'Failed to import redirects.');
    }
  },
});
