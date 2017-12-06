import React from 'react';
import PropTypes from 'prop-types';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

const StandardLayout = props => (
  <div>
    <div className="standard-layout--header">{props.title}</div>
    <div className="standard-layout--content-wrapper">
      <div className="standard-layout--content">
        {props.children}
      </div>
    </div>
  </div>
);

StandardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default StandardLayout;
