import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { leagueList } from '../../../redux/actions';
import { getLeagueList } from '../../../lib/internal-api';
import StandardLayout from '../../layouts/standard';

const pageName = 'PickLeague';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class PickLeague extends Component {
  static fetchData(dispatch, { leaguesList }) {
    return leagueList(Promise.resolve(leaguesList), pageName)(dispatch);
  }

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) this.props.leagueList(getLeagueList(), pageName);
  }

  render() {
    return this.props.updating ?
      <span>Updating</span> // Put inside page wrapper
      :
      <div className='pick-league'>
        <StandardLayout title="Welcome to the new, improved view of Fantasy Premier League">
          <Link to='/standings'>STANDINGS</Link>
          <span>{`I am the pick league page`}</span>
        </StandardLayout>
      </div>;
  }
}

function mapStateToProps({ updating, leaguesList, page }) {
  return { updating, leaguesList, page }
}

export default connect(mapStateToProps, { leagueList })(PickLeague)
