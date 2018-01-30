const webpackMerge = require('webpack-merge'); // eslint-disable-line import/no-extraneous-dependencies
const UglifyJsPlugin = require('uglifyjs-webpack-plugin'); // eslint-disable-line import/no-extraneous-dependencies
const baseWebpackConfig = require('./webpack.config.js');

module.exports = webpackMerge(baseWebpackConfig, {
  devtool: 'source-map',
  plugins: [
    new UglifyJsPlugin(),
  ],
});
