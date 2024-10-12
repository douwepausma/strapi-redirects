// content-types/redirect.ts

const schema = {
  kind: "collectionType",
  collectionName: "redirects",
  info: {
    singularName: "redirect",
    pluralName: "redirects",
    displayName: "Redirects"
  },
  options: {
    draftAndPublish: false,
    comment: ""
  },
  pluginOptions: {
    "content-manager": {
      "visible": false
    },
    "content-type-builder": {
      "visible": false
    }
  },
  attributes: {
    source: {
      "type": "string"
    },
    destination: {
      "type": "string"
    },
    permanent: {
      "type": "boolean"
    }
  }
};

export default {
  schema,
};