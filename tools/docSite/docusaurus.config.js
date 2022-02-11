/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
const { resolve } = require('path');

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.

const docusaurusConfig = {
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        docs: {
          path: resolve('./tmp-docs'),
          editUrl:
            'https://github.com/Tinkoff/tramvai/-/edit/master/docs/get-started/overview.md',
          // sidebars file relative to website dir.
          sidebarPath: require.resolve('./sidebars.public.js'),
          versions: {
            current: {
              banner: 'none',
            },
          },
          remarkPlugins: [
            [require('./plugins/remark/inline'), { cwd: resolve('../../') }],
            require('./plugins/remark/typescript-check'),
            [require('@docusaurus/remark-plugin-npm2yarn'), { sync: true }],
          ],
          exclude: ['**/*.public.md'],
          // rehypePlugins: [[require('rehype-partials'), {}]],
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve('docusaurus-lunr-search'),
      {
        languages: ['en'],
        excludeRoutes: ['docs/changelogs/**/*'],
      },
    ],
  ],

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onDuplicateRoutes: 'throw',

  title: 'tramvai', // Title for your website.
  tagline: 'Modular framework for universal React applications',
  url: 'https://tramvai.dev/', // Your website URL
  baseUrl: '/', // Base URL for your project */
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  favicon: 'img/favicon.png',
  // Used for publishing and more
  projectName: 'tramvai',
  organizationName: 'tinkoff.ru',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  themeConfig: {
    prism: {
      // theme: require('prism-react-renderer/themes/github'),
      // eslint-disable-next-line import/no-extraneous-dependencies
      theme: require('prism-react-renderer/themes/palenight'),
      // eslint-disable-next-line import/no-extraneous-dependencies
      darkTheme: require('prism-react-renderer/themes/vsDark'),
    },
    navbar: {
      title: 'tramvai',
      logo: {
        src: 'img/logo-tinkoff.svg',
      },
      items: [
        { to: 'docs/get-started/overview', label: 'Docs', position: 'right' },
        { to: 'docs/references/tramvai/core', label: 'API', position: 'right' },
        {
          href: 'https://github.com/Tinkoff/tramvai',
          label: 'Repository',
          position: 'right',
        },
      ],
    },
    footer: {
      logo: {
        src: 'img/logo-tinkoff.svg',
      },
      links: [
        {
          title: 'Docs',
          items: [
            { to: 'docs/concepts/overview', label: 'Architecture' },
            { to: 'docs/get-started/create-app', label: 'Get started' },
            { to: 'docs/references/tramvai/core', label: 'API reference' },
          ],
        },
        {
          title: 'Resources',
          items: [
            { label: 'Codesandbox', href: 'https://codesandbox.io/s/tramvai-new-qgk90' },
            
            
          ],
        },
        {
          title: 'Links',
          items: [
            { label: 'Repository', href: 'https://github.com/Tinkoff/tramvai' },
            
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} tinkoff.ru`,
    },
    googleAnalytics: {
      trackingID: 'UA-122261674-2',
    },
  },
};

module.exports = docusaurusConfig;
