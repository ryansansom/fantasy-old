import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mockFetch, modalState } from '../../../redux/actions';
import { mockRealAPI } from '../../mock-api';
import { getStandings } from '../../../lib/internal-api';
import ClassicTable from '../../classic-table';

const pageName = 'Standings';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class Standings extends Component {
  static fetchData(dispatch, { leagueID }) {
    return mockFetch(leagueID ? getStandings(leagueID) : mockRealAPI(), pageName, true)(dispatch);
  }

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) this.props.mockFetch(this.props.params.leagueID ? getStandings(this.props.params.leagueID) : mockRealAPI(), pageName, true)
  }

  render() {
    const { standings } = this.props;
    const refreshLinkUrl = this.props.params.leagueID ? '/standings/' + this.props.params.leagueID : '/standings';

    const sortFunc = (a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints);

    return (
      <div className='standings'>
        { !standings ?
          <span className="no-standings">Loading...</span>
          :
          <div>
            <div className="standings--header">Welcome to the new, improved view of Fantasy Premier League</div>
            <div className="standings--content">
              <div>
                <h2>League Information</h2>
                <div className="league-name">{standings.leagueName}</div>
                <div className="refresh-results--wrapper col-1-of-2">
                  <a
                    className="refresh-results table-button button"
                    onClick={e => {
                      e.preventDefault();
                      return this.props.mockFetch(this.props.params.leagueID ? getStandings(this.props.params.leagueID) : mockRealAPI(), pageName, true);
                    }}
                    href={refreshLinkUrl}>
                    Refresh
                  </a>
                </div>
                <div className="configure-button--wrapper col-1-of-2">
                  <a
                    className="configure-button table-button button"
                    onClick={() => {
                      this.props.modalState('columns');
                    }}>
                    Configure Columns
                  </a>
                </div>
                <div className="table-wrapper">
                  {this.props.updating ?
                   <span>Updating...</span>
                    :
                   <ClassicTable
                     entries={standings.players || standings.entries} // Future support for renaming the API field
                     sortFunc={sortFunc} />
                  }
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps({ standings, updating, page }) {
  return { standings, updating, page }
}

export default connect(mapStateToProps, { mockFetch, modalState })(Standings)
