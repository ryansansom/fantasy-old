import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { leagueList, updatePage } from '../../../redux/actions';
import { getLeagueList } from '../../../lib/internal-api';
import StandardLayout from '../../layouts/standard';

const pageName = 'PickLeague';

const sampleLeagueEnabled = process.env.NODE_ENV !== 'production';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

class PickLeague extends Component {
  static fetchData({ dispatch }, { leaguesList }) {
    updatePage(pageName)(dispatch);

    return leagueList(Promise.resolve(leaguesList), pageName)(dispatch);
  }

  static propTypes = {
    fetchError: PropTypes.bool.isRequired,
    leagueList: PropTypes.func.isRequired,
    leaguesList: PropTypes.arrayOf(PropTypes.object),
    page: PropTypes.string.isRequired,
    updatePage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    leaguesList: null,
  };

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) this.props.updatePage(pageName);
    if (!this.props.leaguesList) this.props.leagueList(getLeagueList());
  }

  renderLeaguesList() {
    if (this.props.leaguesList.length > 0) {
      const newList = JSON.parse(JSON.stringify(this.props.leaguesList));
      if (sampleLeagueEnabled) {
        newList.push({
          leagueId: '',
          leagueName: 'Sample League Data',
        });
      }

      return (
        <ul className="classic-leagues--list">
          {newList.map(league => (
            <li key={league.leagueId} className="league-list-item">
              <Link to={`/standings/${league.leagueId}`}>
                <span className="league-name col-9-of-10">{league.leagueName}</span>
                <span className="link--right col-1-of-10">&gt;</span>
              </Link>
            </li>
          ))}
        </ul>
      );
    }

    return null;
  }

  render() {
    return (
      <div className="pick-league">
        { this.props.fetchError ? (
          <div className="loading">
            <span className="fetch-error">Sorry, there seems to be an error fetching data at this time. Please try again later.</span>
          </div>
        ) : (
          <StandardLayout title="Welcome to the new, improved view of Fantasy Premier League">
            <h1>League Lists</h1>

            <div className="classic-leagues--wrapper">
              <h2>Classic Leagues</h2>
              <p>Pick a league to view the standings:</p>
              { this.props.leaguesList
                ? this.renderLeaguesList()
                : <span>Loading...</span>
              }
            </div>

            <div className="classic-leagues--wrapper">
              <h2>Head-to-head Leagues</h2>
              <p>... Coming soon!</p>
            </div>
          </StandardLayout>
        )}
      </div>
    );
  }
}

function mapStateToProps({
  fetchError, leaguesList, page,
}) {
  return {
    fetchError, leaguesList, page,
  };
}

export default hot(module)(connect(mapStateToProps, { leagueList, updatePage })(PickLeague));
