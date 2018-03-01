process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const config = process.env.NODE_ENV === 'production'
  ? require('./webpack.prod.js')
  : require('./webpack.dev.js');

module.exports = config;
