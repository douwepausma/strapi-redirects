import { Core } from '@strapi/strapi';
import { errors } from '@strapi/utils';
import { validateRedirect } from '../helpers/redirectValidationHelper';

const { ApplicationError } = errors;

interface Value {
  field: string;
  enabled: boolean;
  url: string;
}

type Config = Record<string, Value>;

type UpdateInput = Value & {
  uid: string;
};

export default ({ strapi }: { strapi: Core.Strapi }) => {
  const STORE_KEY = 'config';
  const store = strapi.store({
    type: 'plugin',
    name: 'strapi-redirects',
  });

  const redirectService = strapi.plugin('strapi-redirects').service('redirect');

  return {
    async getRules() {
      return ((await store.get({ key: STORE_KEY })) as Config) || {};
    },

    async getList() {
      const FIELD_TYPES = ['string', 'uid'];
      const SKIP_FIELDS = ['locale'];
      const SKIP_PLUGINS = ['admin', 'upload', 'i18n', 'users-permissions', 'strapi-redirects'];
      const result: any[] = [];

      Object.keys(strapi.contentTypes).forEach((key) => {
        const contentType = strapi.contentTypes[key];
        if (SKIP_PLUGINS.includes(contentType.plugin)) {
          return;
        }

        const fields: { name: string; type: string }[] = [];

        Object.keys(contentType.attributes).forEach((attributeKey) => {
          const attribute = contentType.attributes[attributeKey];

          if (FIELD_TYPES.includes(attribute.type) && !SKIP_FIELDS.includes(attributeKey)) {
            fields.push({
              name: attributeKey,
              type: attribute.type,
            });
          }
        });

        fields.sort((a, b) => {
          if (a.type === 'uid' && b.type !== 'uid') {
            return -1;
          } else if (a.type !== 'uid' && b.type === 'uid') {
            return 1;
          } else {
            return a.name.localeCompare(b.name);
          }
        });

        if (fields.length > 0) {
          result.push({
            uid: contentType.uid,
            info: contentType.info,
            fields,
          });
        }
      });

      const rules = await this.getRules();

      return result.map((item) => {
        const config = rules[item.uid];

        return {
          ...item,
          field: config?.field,
          url: config?.url,
          enabled: config?.enabled,
        };
      });
    },

    async save(update: UpdateInput, generate?: boolean) {
      const rules = await this.getRules();
      const rule = rules[update.uid];

      await store.set({
        key: STORE_KEY,
        value: {
          ...rules,
          [update.uid]: {
            field: update.field,
            url: update.url,
            enabled: update.enabled,
          },
        },
      });

      const urlChanged = rule && update.url !== rule.url;
      const fieldChanged = rule && update.field !== rule.field;
      const created: any[] = [];

      // URL structure changed; redirect all old URLs to new URLs
      if (urlChanged || fieldChanged) {
        // Fetch all documents of the content type using strapi.documents
        const items = await strapi.query(update.uid as any).findMany({
          limit: -1
        });

        for (const item of items) {
          const sourceField = rule?.field;
          const destinationField = update.field;

          if (!sourceField || !destinationField) {
            continue;
          }

          const sourceValue = item[sourceField];
          const destinationValue = item[destinationField];

          if (!sourceValue || !destinationValue) {
            continue;
          }

          const sourceUrl = redirectService.format(rule.url, sourceValue, item.locale);
          const destinationUrl = redirectService.format(update.url, destinationValue, item.locale);

          if (sourceUrl !== destinationUrl) {
            const redirectData = {
              source: sourceUrl,
              destination: destinationUrl,
              permanent: true, // Adjust as needed
            };

            // Validate the redirect
            const validity = await validateRedirect(redirectData);

            if (!validity.ok) {
              // Handle invalid redirect (e.g., log the error or skip)
              console.error(
                `Invalid redirect from '${sourceUrl}' to '${destinationUrl}': ${validity.errorMessage}`
              );
              continue;
            }

            // Create the redirect
            try {
              const createdRedirect = await redirectService.create(redirectData);
              created.push(createdRedirect);
            } catch (error) {
              console.error(`Error creating redirect from '${sourceUrl}' to '${destinationUrl}':`, error);
            }
          }
        }
      }

      return {
        created,
      };
    },
  };
};
