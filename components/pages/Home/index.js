import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { increment, decrement, mockFetch } from '../../../redux/actions';
import { mockAPI } from '../../mock-api';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class Home extends React.Component {
  static fetchData(dispatch) {
    const promise = mockFetch(mockAPI(10));
    return promise(dispatch)
  }

  componentDidMount() {
    this.props.mockFetch(mockAPI(10));
  }

  render() {
    return (<div className='home'>
      <button onClick={() => this.props.increment()}>Up</button>
      <button onClick={() => this.props.decrement()}>Down</button>
      <span>Go to...</span>
      <Link to='/about'>About</Link>
      <span>{`I have ${this.props.count} items in my count`}</span>
      <button onClick={() => this.props.mockFetch(mockAPI(10))}>Refresh</button>
    </div>);
  }
}

function mapStateToProps({ count }) {
  return { count }
}

export default connect(mapStateToProps, { increment, decrement, mockFetch })(Home)
