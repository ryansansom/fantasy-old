import React from 'react';

if (process.env.CLIENT_RENDER) {
  require('../../site/assets/styles/normalize.css');
  require('../../site/assets/styles/generic.css');
}

export default class App extends React.Component {
  render() {
   return (this.props.children)
  }
}
