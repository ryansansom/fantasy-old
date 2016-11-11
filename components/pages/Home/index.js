import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { increment, decrement, mockFetch } from '../../../redux/actions';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class Home extends React.Component {
  componentDidMount() {
    this.props.mockFetch();
  }
  render() {
    return (<div className='home'>
      <button onClick={() => this.props.increment()}>Up</button>
      <button onClick={() => this.props.decrement()}>Down</button>
      <span>Go to...</span>
      <Link to='/about'>About</Link>
      <span>{`I have ${this.props.count} items in my count`}</span>
      <button onClick={() => this.props.mockFetch()}>Refresh</button>
    </div>);
  }
}

function mapStateToProps({ count }) {
  return { count }
}

export default connect(mapStateToProps, { increment, decrement, mockFetch })(Home)
