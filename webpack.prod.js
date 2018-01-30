const webpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseWebpackConfig = require('./webpack.config.js');

module.exports = webpackMerge(baseWebpackConfig, {
  devtool: 'source-map',
  plugins: [
    new UglifyJsPlugin(),
  ],
});
