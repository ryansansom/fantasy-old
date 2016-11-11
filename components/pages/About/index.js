import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { mockFetch } from '../../../redux/actions';
import { mockAPI } from '../../mock-api';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class About extends React.Component {
  static fetchData(dispatch) {
    const promise = mockFetch(mockAPI(20));
    return promise(dispatch)
  }

  componentDidMount() {
    this.props.mockFetch(mockAPI(20));
  }

  render() {
    return (<div className='about'>
      <span>Go to...</span>
      <Link to='/'>Home</Link>
      <span>{`I have ${this.props.count} items in my count`}</span>
      <button onClick={() => this.props.mockFetch(mockAPI(20))}>Refresh</button>
    </div>)
  }
}

function mapStateToProps({ count }) {
  return { count }
}

export default connect(mapStateToProps, { mockFetch })(About)
