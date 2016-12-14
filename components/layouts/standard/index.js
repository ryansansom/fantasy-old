import React, { PropTypes } from 'react';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

const StandardLayout = (props) => {
  return (
    <div>
      <div className="standard-layout--header">{props.title}</div>
      <div className="standard-layout--content">
        {props.children}
      </div>
    </div>
  );
};

StandardLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired
};

export default StandardLayout;
