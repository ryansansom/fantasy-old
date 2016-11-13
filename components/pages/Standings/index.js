import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { mockRealFetch } from '../../../redux/actions';
import { mockRealAPI } from '../../mock-api';

const pageName = 'Standings';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class Standings extends React.Component {
  static fetchData(dispatch) {
    return mockRealFetch(mockRealAPI(), pageName)(dispatch);
  }

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) this.props.mockRealFetch(mockRealAPI(), pageName);
  }

  render() {
    return (
      this.props.updating ?
      <span>Updating</span>
      :
      <div className='home'>
        <span>{`I have ${typeof this.props.standings} as data`}</span>
        <Link to='/about'>About</Link>
        <button onClick={() => this.props.mockRealFetch(mockRealAPI(), pageName)}>Refresh</button>
      </div>);
  }
}

function mapStateToProps({ standings, updating, page }) {
  return { standings, updating, page }
}

export default connect(mapStateToProps, { mockRealFetch })(Standings)
