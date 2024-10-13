export default [
    {
        method: "GET",
        path: "/:id",
        handler: "redirectController.findOne",
        config: { 
            policies: ["admin::isAuthenticatedAdmin"]
        },
      },
      {
        method: "GET",
        path: "/",
        handler: "redirectController.findAll",
        config: { 
            policies: ["admin::isAuthenticatedAdmin"]
        },
      },
      {
        method: "POST",
        path: "/",
        handler: "redirectController.create",
        config: { 
            policies: ["admin::isAuthenticatedAdmin"]
        },
      },
      {
        method: "PUT",
        path: "/:id",
        handler: "redirectController.update",
        config: { 
            policies: ["admin::isAuthenticatedAdmin"]
        },
      },
      {
        method: "DELETE",
        path: "/:documentId",
        handler: "redirectController.delete",
        config: { 
            policies: ["admin::isAuthenticatedAdmin"]
        },
      },
      {
        method: "POST",
        path: "/import",
        handler: "redirectController.import",
        config: { 
            policies: ["admin::isAuthenticatedAdmin"]
        },
      },
];