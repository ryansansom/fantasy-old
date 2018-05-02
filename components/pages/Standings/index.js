import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { fetchStandings, openModal, updatePage } from '../../../redux/actions';
import { getFetchError, getPage, getLeagueStandings, getClassicLeagueName, hasEntries } from '../../../redux/reducers';
import graphqlExecutor from '../../../lib/graphql-executor';
import ClassicTable from '../../classic-table';
import StandingStatusInfo from '../../standings-status-info';
import StandardLayout from '../../layouts/standard';

const pageName = 'Standings';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

class Standings extends Component {
  static propTypes = {
    fetchError: PropTypes.bool.isRequired,
    fetchStandings: PropTypes.func.isRequired,
    hasEntries: PropTypes.bool.isRequired,
    leagueName: PropTypes.string.isRequired,
    openModal: PropTypes.func.isRequired,
    page: PropTypes.string.isRequired,
    params: PropTypes.shape({
      leagueID: PropTypes.string.isRequired,
    }).isRequired,
    standings: PropTypes.shape({
      entries: PropTypes.array,
      lastUpdated: PropTypes.number,
      leagueName: PropTypes.string,
      players: PropTypes.array,
    }),
    updatePage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    standings: {},
  };

  static fetchData({ dispatch, getState }, { leagueID, graphqlContext }) {
    updatePage(pageName)(dispatch);

    return fetchStandings(graphqlExecutor(graphqlContext), leagueID)(dispatch, getState);
  }

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) {
      this.props.updatePage(pageName);
      this.props.fetchStandings(graphqlExecutor(), this.props.params.leagueID);
    }
  }

  render() {
    const { fetchError } = this.props;

    return (
      <div className="standings">
        { fetchError && (
          <div className="loading">
            <span className="fetch-error">Sorry, there seems to be an error fetching data at this time</span>
            <Link to="/">Go Back</Link>
          </div>
          )
        }
        { !fetchError && (
          <StandardLayout title="Welcome to the new, improved view of Fantasy Premier League">
            <h2 className="league-header">League Information</h2>
            <div className="league-name">
              <span>{ this.props.leagueName || 'Loading...' }</span>
              <span> (</span>
              <Link to="/">change...</Link>
              <span>)</span>
            </div>
            <div className="refresh-results--wrapper col-1-of-2">
              <a
                className="refresh-results table-button button"
                onClick={(e) => {
                  e.preventDefault();

                  return this.props.fetchStandings(graphqlExecutor(), this.props.params.leagueID);
                }}
                href={`/standings/${this.props.params.leagueID}`}
              >
                Refresh
              </a>
            </div>
            <div className="configure-button--wrapper col-1-of-2">
              <button
                className="configure-button table-button button"
                onClick={() => {
                  this.props.openModal('COLUMNS');
                }}
              >
                Configure Columns
              </button>
            </div>
            <StandingStatusInfo
              leagueId={this.props.params.leagueID}
            />
            <div className="table-wrapper">
              { !this.props.hasEntries
                ? <span>Loading...</span>
                : (
                  <ClassicTable
                    leagueId={this.props.params.leagueID}
                  />
                )
              }
            </div>
          </StandardLayout>
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    fetchError: getFetchError(state),
    leagueName: getClassicLeagueName(state, { leagueId: ownProps.params.leagueID }),
    hasEntries: hasEntries(state, { leagueId: ownProps.params.leagueID }),
    page: getPage(state),
  };
}

export default hot(module)(connect(mapStateToProps, { fetchStandings, openModal, updatePage })(Standings));
