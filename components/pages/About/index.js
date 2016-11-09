import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class About extends React.Component {
  render() {
    return (<div className='about'>
      <span>Go to...</span>
      <Link to='/'>Home</Link>
      <span>{`I have ${this.props.count} items in my count`}</span>
    </div>)
  }
}

function mapStateToProps({ count }) {
  return { count }
}

export default connect(mapStateToProps)(About)
