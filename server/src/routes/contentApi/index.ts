export default [
  {
    method: 'GET',
    path: '/',
    handler: 'contentController.findAll',
    config: {
      policies: [],
    },
  },
];
