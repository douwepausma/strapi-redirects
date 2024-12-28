export default [
  {
    method: 'GET',
    path: '/content-types',
    handler: 'settingsController.getContentTypes',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'GET',
    path: '/settings',
    handler: 'settingsController.getSettings',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'POST',
    path: '/settings',
    handler: 'settingsController.updateSettings',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'GET',
    path: '/:id',
    handler: 'redirectsController.findOne',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'GET',
    path: '/',
    handler: 'redirectsController.findAll',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'POST',
    path: '/',
    handler: 'redirectsController.create',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'PUT',
    path: '/:id',
    handler: 'redirectsController.update',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'DELETE',
    path: '/:documentId',
    handler: 'redirectsController.delete',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
  {
    method: 'POST',
    path: '/import',
    handler: 'redirectsController.import',
    config: {
      policies: ['admin::isAuthenticatedAdmin'],
    },
  },
];
