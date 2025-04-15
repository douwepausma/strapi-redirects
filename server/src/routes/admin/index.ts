export default [
  {
    method: 'GET',
    path: '/content-types',
    handler: 'settingsController.getContentTypes',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/settings',
    handler: 'settingsController.getSettings',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/settings',
    handler: 'settingsController.updateSettings',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/:id',
    handler: 'redirectsController.findOne',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/',
    handler: 'redirectsController.findAll',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/',
    handler: 'redirectsController.create',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/:id',
    handler: 'redirectsController.update',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'DELETE',
    path: '/:documentId',
    handler: 'redirectsController.delete',
    config: {
      policies: [],
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/import',
    handler: 'redirectsController.import',
    config: {
      policies: [],
      auth: false,
    },
  },
];
