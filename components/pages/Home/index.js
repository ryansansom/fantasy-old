import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { increment, decrement, mockFetch } from '../../../redux/actions';
import { mockAPI } from '../../mock-api';

const pageName = 'Home';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class Home extends React.Component {
  static fetchData(dispatch) {
    return mockFetch(mockAPI(10), pageName)(dispatch);
  }

  componentDidMount() {
    if (this.props.page !== pageName) this.props.mockFetch(mockAPI(10), pageName);
  }

  render() {
    return (
      this.props.updating ?
      <span>Updating</span>
      :
      <div className='home'>
        <button onClick={() => this.props.increment()}>Up</button>
        <button onClick={() => this.props.decrement()}>Down</button>
        <span>Go to...</span>
        <Link to='/about'>About</Link>
        <span>{`I have ${this.props.count} items in my count`}</span>
        <button onClick={() => this.props.mockFetch(mockAPI(10), pageName)}>Refresh</button>
      </div>);
  }
}

function mapStateToProps({ count, updating, page }) {
  return { count, updating, page }
}

export default connect(mapStateToProps, { increment, decrement, mockFetch })(Home)
