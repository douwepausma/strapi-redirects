# Strapi Plugin for Managing Redirects

This plugin provides a simple way to manage URL redirects within Strapi (v5), allowing developers and content managers to create and handle redirects directly from the CMS. The plugin does not automatically handle redirects on the server side, but instead offers a structured API that your frontend application (like a Next.js site) can use to implement redirection logic.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/alex-strapi/strapi-redirects/#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/alex-strapi/strapi-redirects/graphs/commit-activity)
[![License: MIT](https://img.shields.io/github/license/alex-strapi/strapi-redirects)](https://github.com/alex-strapi/strapi-redirects/blob/master/LICENSE)
[![Twitter: webbist](https://img.shields.io/twitter/follow/webbist.svg?style=social)](https://twitter.com/webbist)

## Features

- **Admin Panel Integration:** Adds a "Redirects" section in the Strapi admin panel for easy management.
- **Flexible Redirects Management:** Create and manage redirects by specifying the source URL (`Source`), the destination URL (`Destination`), and whether the redirect is permanent (`Permanent`).
- **Bulk Import:** Supports importing redirects in bulk through a CSV upload.
- **API Endpoint:** Redirects are accessible via a structured API endpoint at `/api/redirects`, making it easy for frontend applications to fetch and implement redirects.
- **Redirect Validation:** Validates new redirects to prevent duplicate or looping rules.

## Getting Started

### Installation

1. Install the plugin using npm or yarn:

`npm install strapi-plugin-redirects` or `yarn add strapi-plugin-redirects`

2. Enable the plugin in Strapi by adding it to your ./config/plugins.js:

```
module.exports = ({ env }) => ({
  // Other plugin configurations...
  redirects: {
    enabled: true,
  },
});
```

3. Restart your Strapi server for the changes to take effect.

## How to Use

1. Access the Strapi admin panel and locate the `Redirects` section within the plugins area.
2. To add a new redirect, click on `Add New Redirect` and fill in the `Source`, `Destination`, and `Permanent` fields accordingly.
3. After saving, the new redirect will be available at the `api/redirects` endpoint.
4. To fetch redirects, send a GET request to `api/redirects`. The response will be a JSON object listing all configured redirects.
5. Set the permissions of the plugin in Strapi settings > Redirects > FindAll or allow access to this endpoint with an [API token](https://docs.strapi.io/dev-docs/configurations/api-tokens).

### Strapi REST API Response Limits (optional)

If your project contains a large number of redirects (hundreds or thousands), you may need to adjust the default and maximum limits for the REST API responses in Strapi. This can be done by modifying the `api.js` or `api.ts` file in your Strapi configuration. You can set the `defaultLimit` and `maxLimit` for your API responses as shown below:

```
module.exports = ({ env }) => ({
  rest: {
    defaultLimit: 100, // Default number of items returned in a single response
    maxLimit: 250,     // Maximum number of items allowed in a single response
  },
});
```

### Importing Redirects

You can import redirects in bulk by uploading a CSV file with `source`, `destination`, and `permanent` headers. Both relative and absolute paths are supported for maximum flexibility, and specifying `permanent` or `temporary` via a boolean field correctly maps to the respective redirect type.

## Example Usage with Next.js

This plugin is ideal for content editors or SEO specialists managing redirects in a headless CMS setup. Here's how you can integrate it with a Next.js project:

1. Fetch redirects during the build process to include them in `next.config.js`.

Example script for fetching redirects:

```
const redirects = () => {
  return fetch('http://localhost:1337/api/redirects')
    .then(res => res.json())
    .then(response => {
      // Use redirects however you need to
    });
};

module.exports = redirects;
```

Incorporate the fetched redirects into next.config.js:

```
const getRedirects = require('./redirects');

module.exports = {
  // Other configurations...
  redirects: () => getRedirects(),
};
```

## Contributions

Contributions in the form of translations, feature enhancements, and bug fixes are highly encouraged and appreciated.

Feel free to reach out or submit pull requests on GitHub if you're interested in contributing to the development of this plugin.

## License

This plugin is available under the MIT License. For more information, please refer to the LICENSE file in the repository.
