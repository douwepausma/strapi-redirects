/**
 *  controller
 */

import type { Core } from '@strapi/types';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  findAll: async (ctx) => {
    // Fetch all redirects
    const redirects = await strapi.plugin('redirects').service('contentService').findAll();

    // Format the response to include only required fields
    const formattedRedirects = redirects.map((redirect) => ({
      source: redirect.source,
      destination: redirect.destination,
      permanent: redirect.permanent,
    }));

    ctx.body = formattedRedirects;
  },
});
