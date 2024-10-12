import { IntlShape } from 'react-intl';
import { Table } from '@strapi/admin/strapi-admin';
import { getTranslation } from './getTranslation';

export interface RedirectTableHeader extends Table.Header<any, any> {
  name: string;
  label: string;
  key: string;
  isSortable: boolean;
}

const tableHeaders = (formatMessage: IntlShape['formatMessage']): RedirectTableHeader[] => [
  {
    name: 'source',
    label: formatMessage({
      id: getTranslation('overview.table.headers.source'),
      defaultMessage: 'Source',
    }),
    key: 'source',
    isSortable: false,
  },
  {
    name: 'destination',
    label: formatMessage({
      id: getTranslation('overview.table.headers.destination'),
      defaultMessage: 'Destination',
    }),
    key: 'destination',
    isSortable: false,
  },
  {
    name: 'permanent',
    label: formatMessage({
      id: getTranslation('overview.table.headers.permanent'),
      defaultMessage: 'Permanent',
    }),
    key: 'permanent',
    isSortable: true,
  },
  {
    name: 'actions',
    label: formatMessage({
      id: getTranslation('overview.table.headers.actions'),
      defaultMessage: 'Actions',
    }),
    key: 'actions',
    isSortable: false,
  },
];

export { tableHeaders };
