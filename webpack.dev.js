const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.js');

module.exports = webpackMerge(baseWebpackConfig, {
  devtool: 'eval',
  output: {
    publicPath: 'http://localhost:8080/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env'],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            'react-hot-loader/babel',
          ],
        },
      },
      { test: /\.json$/, loader: 'json-loader' },

      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    contentBase: './site/public/wp',
    publicPath: 'http://localhost:8080/',
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
});
