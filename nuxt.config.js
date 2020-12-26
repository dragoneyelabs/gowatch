import es from 'vuetify/es5/locale/es';
require('dotenv').config();

export default {
  mode: 'spa',
  head: {
    titleTemplate: '%s',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700|Montserrat&display=swap',
      },
      {
        rel: 'stylesheet',
        crossorigin: 'anonymous',
        href: 'https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css',
      },
    ],
  },
  // Customize the progress-bar color
  loading: { color: '#fff' },
  css: [
    '~/assets/styles.scss',
  ],
  plugins: [],
  buildModules: [
    '@nuxtjs/vuetify',
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
  ],
  modules: [
    '@nuxtjs/pwa',
    '@nuxtjs/dotenv',
  ],
  vuetify: {
    treeShake: true,
    defaultAssets: false,
    customVariables: ['~/assets/variables.scss'],
    lang: {
      locales: { es },
      current: 'es',
    },
  },
  router: {
    base: '/gowatch/',
  },
  build: {
    // You can extend webpack config here
    extend(config, ctx) {},
  },
};
