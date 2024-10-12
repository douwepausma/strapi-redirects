export default [
    {
        method: 'GET',
        path: '/',
        handler: 'contentController.find',
        config: {
          auth: false,
          policies: [],
        }
    },
 ];