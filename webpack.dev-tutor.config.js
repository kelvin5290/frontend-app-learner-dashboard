// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require('webpack-merge');

const baseDevConfig = require('./webpack.dev.config');

module.exports = merge(baseDevConfig, {
  // This configuration needs to be defined here, because CLI
  // arguments are ignored by the "npm run start" command
  devServer: {
    // We will have to make changes to this config in later releases of webpack devServer
    // https://github.com/webpack/webpack-dev-server/blob/master/migration-v4.md
    allowedHosts: 'all',
    proxy: {
      '/api/mfe_config/v1': 'http://127.0.0.1:8000',
    },
  },
});
