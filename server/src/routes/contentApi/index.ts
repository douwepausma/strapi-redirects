export default [
  {
    method: 'GET',
    path: '/',
    handler: 'contentController.findAll',
    config: {
      policies: [],
    },
  },
  {
    method: 'GET',
    path: '/:id',
    handler: 'redirectsController.findOne',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/',
    handler: 'redirectsController.create',
    config: {
      policies: [],
    },
  },
  {
    method: 'PUT',
    path: '/:id',
    handler: 'redirectsController.update',
    config: {
      policies: [],
    },
  },
  {
    method: 'DELETE',
    path: '/:documentId',
    handler: 'redirectsController.delete',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/import',
    handler: 'redirectsController.import',
    config: {
      policies: [],
    },
  }
];
