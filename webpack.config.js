var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './routes/ui/client.js',
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'site/public/wp')
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['jsx-loader', 'babel-loader']
      },
      { test: /\.json$/, loader: 'json-loader' }
    ],
    loaders: [
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('css-loader!less-loader')
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader')
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        CLIENT_RENDER: true
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js'
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    // Uglify on prod. Need to add.
    // new webpack.optimize.UglifyJsPlugin({minimize: true}),
    new ExtractTextPlugin('[name].css', {
      allChunks: true
    })
  ]
};
