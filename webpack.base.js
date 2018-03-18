const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');

const nodeEnv = process.env.NODE_ENV || 'production';

module.exports = {
  entry: './routes/ui/client.js',
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'site/public/wp'),
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(nodeEnv),
        CLIENT_RENDER: true,
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: ({ resource }) => /node_modules/.test(resource),
    }),
    // TODO: We can we-include this when we have split bundles
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common',
    //   filename: 'common.js',
    // }),
    new ManifestPlugin({
      basePath: '/',
      map: (bundle) => {
        const prefix = process.env.NODE_ENV === 'production' ? '/wp/' : 'http://localhost:8080/';
        bundle.path = `${prefix}${bundle.path}`;
        return bundle;
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(true),
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
