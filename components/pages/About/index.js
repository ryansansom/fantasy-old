import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { mockFetch } from '../../../redux/actions';
import { mockAPI } from '../../mock-api';

const pageName = 'About';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class About extends React.Component {
  static fetchData(dispatch) {
    const promise = mockFetch(mockAPI(20), pageName);
    return promise(dispatch)
  }

  componentDidMount() {
    if (this.props.page !== pageName) this.props.mockFetch(mockAPI(20), pageName);
  }

  render() {
    return (
      this.props.updating ?
      <span>Updating</span>
      :
      <div className='about'>
        <span>Go to...</span>
        <Link to='/'>Home</Link>
        <span>{`I have ${this.props.count} items in my count`}</span>
        <button onClick={() => this.props.mockFetch(mockAPI(20), pageName)}>Refresh</button>
      </div>)
  }
}

function mapStateToProps({ count, updating, page }) {
  return { count, updating, page }
}

export default connect(mapStateToProps, { mockFetch })(About)
