const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name]-css.css');
const extractLESS = new ExtractTextPlugin('[name]-less.css');

const nodeEnv = process.env.NODE_ENV || 'production';

module.exports = {
  entry: './routes/ui/client.js',
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'site/public/wp'),
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['jsx-loader', 'babel-loader'],
      },
      { test: /\.json$/, loader: 'json-loader' },

      {
        test: /\.less$/,
        loader: extractLESS.extract({
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
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
        CLIENT_RENDER: true,
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    extractLESS,
    extractCSS,
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
