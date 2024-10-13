import { IntlShape } from 'react-intl';
import { getTranslation } from './getTranslation';
import { RedirectTableHeader } from '../../../types/redirectPluginTypes';

const tableHeaders = (formatMessage: IntlShape['formatMessage']): RedirectTableHeader[] => [
  {
    name: 'source',
    label: formatMessage({
      id: getTranslation('overview.table.headers.source'),
      defaultMessage: 'Source',
    }),
    key: 'source',
    isSortable: true,
  },
  {
    name: 'destination',
    label: formatMessage({
      id: getTranslation('overview.table.headers.destination'),
      defaultMessage: 'Destination',
    }),
    key: 'destination',
    isSortable: true,
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
