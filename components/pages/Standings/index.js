import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { fetchStandings } from '../../../redux/actions';
import { mockRealAPI } from '../../mock-api';
import { getStandings, postColumnCookie } from '../../../lib/internal-api';
import ClassicTable from '../../classic-table';
import StandardLayout from '../../layouts/standard';

const pageName = 'Standings';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

function standingsData(leagueID) {
  return leagueID
    ? getStandings(leagueID)
    : mockRealAPI();
}

class Standings extends Component {
  static fetchData(dispatch, { leagueID }) {
    return fetchStandings(standingsData(leagueID), pageName, true)(dispatch);
  }

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: ''
    }
  }

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) this.props.fetchStandings(standingsData(this.props.params.leagueID), pageName, true)
  }

  closeModal(newConfig) {
    // TODO: Compare new config with old and post only if changed
    postColumnCookie(newConfig);

    return this.setState({
      modalOpen: ''
    });
  }

  render() {
    const { fetchError, standings } = this.props;
    const refreshLinkUrl = this.props.params.leagueID ? '/standings/' + this.props.params.leagueID : '/standings';

    const sortFunc = (a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints);

    return (
      <div className='standings'>
        { fetchError &&
          <div className="loading">
            <span className="fetch-error">Sorry, there seems to be an error fetching data at this time</span>
            <Link to="/">{'Go Back'}</Link>
          </div>
        }
        { !fetchError && (!standings ?
          <span className="loading">Loading...</span>
          :
          <StandardLayout title="Welcome to the new, improved view of Fantasy Premier League">
            <h2 className="league-header">League Information</h2>
            <div className="league-name">
              <span>{standings.leagueName}</span>
              <span> (</span>
              <Link to="/">{'change...'}</Link>
              <span>)</span>
            </div>
            <div className="refresh-results--wrapper col-1-of-2">
              <a
                className="refresh-results table-button button"
                onClick={e => {
                  e.preventDefault();
                  return this.props.fetchStandings(this.props.params.leagueID ? getStandings(this.props.params.leagueID) : mockRealAPI(), pageName, true);
                }}
                href={refreshLinkUrl}>
                Refresh
              </a>
            </div>
            <div className="configure-button--wrapper col-1-of-2">
              <div
                className="configure-button table-button button"
                onClick={() => {
                  this.setState({
                    modalOpen: 'COLUMNS'
                  });
                }}>
                Configure Columns
              </div>
            </div>
            <div className="table-wrapper">
              {this.props.updating ?
               <span>Updating...</span>
                :
               <ClassicTable
                 entries={standings.players || standings.entries} // Future support for renaming the API field
                 sortFunc={sortFunc}
                 modalOpen={this.state.modalOpen}
                 closeModal={::this.closeModal} />
              }
            </div>
          </StandardLayout>
        )}
      </div>
    );
  }
}

function mapStateToProps({ fetchError, standings, updating, page }) {
  return { fetchError, standings, updating, page }
}

export default connect(mapStateToProps, { fetchStandings })(Standings)
