import { factories } from '@strapi/strapi';

export default factories.createCoreService('plugin::redirects.redirect', ({ strapi }) => ({
  async findAll() {
    return await strapi.documents('plugin::redirects.redirect').findMany({
      limit: -1,
      start: 0,
    });
  },
}));
