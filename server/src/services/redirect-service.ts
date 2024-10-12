// src/plugins/your-plugin-name/services/redirect.ts
import { pick } from 'lodash';

import { errors } from '@strapi/utils';
import { factories } from '@strapi/strapi';
import type { Core } from '@strapi/types';

const { ApplicationError } = errors;
import { validateRedirect } from '../helpers/redirectValidationHelper';

export interface RedirectInput {
  source: string;
  destination: string;
  permanent: boolean;
}

export type ImportStatus = 'INVALID' | 'ERROR' | 'UPDATED' | 'CREATED';

export interface ImportResult extends RedirectInput {
  status: ImportStatus;
  reason?: string;
  details?: any;
  error?: string;
}

export interface FindAllParams {
  sort?: string | string[];
  filters?: Record<string, any>;
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
}

export default factories.createCoreService(
  'plugin::strapi-redirects.redirect',
  ({ strapi }: { strapi: Core.Strapi }) => ({
    format(urlTemplate: string, fieldValue: string, locale = '') {
      return urlTemplate.replace('[field]', fieldValue).replace('[locale]', locale);
    },
    /**
     * Find a single redirect
     *
     * @param id
     * @returns
     */
    async findOne(id: string) {
      const result = await strapi
        .documents('plugin::strapi-redirects.redirect')
        .findOne({ documentId: id });

      return result;
    },

    /**
     * Find all redirects
     *
     * @param params
     * @returns
     */
    async findAll(params: FindAllParams = {}) {
      const { sort = 'documentId:desc', filters = {}, pagination = {} } = params;

      const redirects = await strapi.documents('plugin::strapi-redirects.redirect').findMany({
        filters,
        sort,
        pagination,
      });

      const total = await strapi.documents('plugin::strapi-redirects.redirect').count({ filters });

      return {
        redirects,
        total,
      };
    },

    /**
     * Create a redirect
     *
     * @param redirect
     * @returns
     */
    async create(redirect: RedirectInput) {
      const result = await strapi
        .documents('plugin::strapi-redirects.redirect')
        .create({ data: redirect });
      return result;
    },

    /**
     * Update a redirect
     *
     * @param id
     * @param redirect
     * @returns
     */
    async update(id: string, redirectData: RedirectInput) {
      const validity = await validateRedirect(redirectData, id);

      if (!validity.ok) {
        throw new ApplicationError(validity.errorMessage, validity.details);
      }

      const updateParams: any = {
        documentId: id,
        data: redirectData,
      };

      const result = await strapi
        .documents('plugin::strapi-redirects.redirect')
        .update(updateParams);

      return result;
    },

    /**
     * Delete a redirect
     *
     * @param id
     * @returns
     */
    async delete(documentId: string) {
      return await strapi.documents('plugin::strapi-redirects.redirect').delete({ documentId });
    },

    /**
     * Import redirects
     *
     * @param data
     * @returns
     */
    async import(data: (RedirectInput & Partial<{ status: string }>)[]): Promise<ImportResult[]> {
      const importResults: ImportResult[] = [];

      for (const row of data) {
        const rowWithStatus = row as RedirectInput & { status?: string };

        // Skip processing for rows already marked as INVALID
        if (rowWithStatus.status === 'INVALID') {
          importResults.push({
            ...rowWithStatus,
            status: 'INVALID',
          });
          continue;
        }

        try {
          const validity = await validateRedirect(row);

          if (!validity.ok) {
            const invalidResult: ImportResult = {
              ...row,
              status: 'INVALID',
              reason: validity.errorMessage,
              details: validity.details,
            };
            importResults.push(invalidResult);
            continue;
          }

          // Extract only valid fields
          const dataToSave: RedirectInput = {
            source: row.source,
            destination: row.destination,
            permanent: row.permanent,
          };

          let operationResult;
          const existingRedirects = await strapi
            .documents('plugin::strapi-redirects.redirect')
            .findMany({
              filters: { source: row.source },
            });

          if (existingRedirects.length > 0) {
            const existingRedirect = existingRedirects[0];

            const updateParams: any = {
              documentId: existingRedirect.documentId,
              data: dataToSave,
            };

            operationResult = await strapi
              .documents('plugin::strapi-redirects.redirect')
              .update(updateParams);

            const updatedResult: ImportResult = {
              ...operationResult,
              status: 'UPDATED',
              details: { type: 'UPDATED' },
            };
            importResults.push(updatedResult);
          } else {
            operationResult = await strapi
              .documents('plugin::strapi-redirects.redirect')
              .create({ data: dataToSave });

            const createdResult: ImportResult = {
              ...operationResult,
              status: 'CREATED',
              details: { type: 'CREATED' },
            };
            importResults.push(createdResult);
          }
        } catch (e: any) {
          console.error('Error during import operation', e);
          const errorResult: ImportResult = {
            ...row,
            status: 'ERROR',
            error: e.message,
          };
          importResults.push(errorResult);
        }
      }

      return importResults;
    },
  })
);
