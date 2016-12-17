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

  renderLeaguesList() {
    const mainList = this.props.leaguesList.map(league => {
      return (
        <li key={league.leagueId}>
          <Link to={"/standings/" + league.leagueId}>{league.leagueName}</Link>
        </li>
      );
    });

    if (process.env.NODE_ENV !== 'production') mainList.push(
      <li key='dummy'>
        <Link to={"/standings/"}>Sample League Data</Link>
      </li>
    );

    return (
      <ul className="classic-leagues--list">
        {mainList}
      </ul>
    );
  }

  render() {
    return this.props.updating ?
      <span>Updating</span> // Put inside page wrapper
      :
      <div className='pick-league'>
        <StandardLayout title="Welcome to the new, improved view of Fantasy Premier League">
          <h1>League Lists</h1>

          <h2>Classic Leagues</h2>
          {this.props.leaguesList && this.renderLeaguesList()}

          <h2>Head-to-head Leagues</h2>
          <p>... Coming soon!</p>
        </StandardLayout>
      </div>;
  }
}

function mapStateToProps({ updating, leaguesList, page }) {
  return { updating, leaguesList, page }
}

export default connect(mapStateToProps, { leagueList })(PickLeague)
