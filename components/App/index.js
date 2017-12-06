import React from 'react';
import PropTypes from 'prop-types';

if (process.env.CLIENT_RENDER) {
  require('../../site/assets/styles/normalize.css');
  require('../../site/assets/styles/generic.less');
  require('../../site/assets/styles/grid.less');
}

export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    return (this.props.children);
  }
}
