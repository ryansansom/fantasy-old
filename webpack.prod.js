const path = require('path');
const webpackMerge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin({
  filename: '[name].[hash].css',
});

module.exports = webpackMerge(baseWebpackConfig, {
  output: {
    filename: '[name].[hash].js',
    path: path.join(__dirname, 'site/public/wp'),
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env'],
          plugins: [
            'transform-class-properties',
            'react-hot-loader/babel',
          ],
        },
      },
      { test: /\.json$/, loader: 'json-loader' },

      {
        test: /\.less$/,
        loader: extractCSS.extract({
          use: ['css-loader', 'less-loader'],
        }),
      },
      {
        test: /\.css$/,
        loader: extractCSS.extract({
          use: 'css-loader',
        }),
      },
    ],
  },
  plugins: [
    extractCSS,
    new UglifyJsPlugin(),
  ],
});
