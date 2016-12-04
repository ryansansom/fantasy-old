import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mockFetch } from '../../../redux/actions';
import { mockRealAPI } from '../../mock-api';
import { getStandings, postColumnCookie } from '../../../lib/internal-api';
import ClassicTable from '../../classic-table';

const pageName = 'Standings';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

function checkConfigChange(oldConfig, newConfig) {
  if (oldConfig.length !== newConfig.length) return true;

  for (let i = 0, len = oldConfig.length; i < len; i++) {
    if (oldConfig[i].header !== newConfig[i].header) return true;
  }

  return false;
}

class Standings extends Component {
  static fetchData(dispatch, { leagueID }) {
    return mockFetch(leagueID ? getStandings(leagueID) : mockRealAPI(), pageName, true)(dispatch);
  }

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) this.props.mockFetch(this.props.params.leagueID ? getStandings(this.props.params.leagueID) : mockRealAPI(), pageName, true)
  }

  constructor() {
    super();
    this.state = {
      modalOpen: false
    }
  }

  closeModal(body) {
    // Compare new config with old and post if changed.
    const tableColChange = checkConfigChange(this.props.columns.tableCols, body.newConfig.tableCols);
    const playerColChange = checkConfigChange(this.props.columns.playerCols, body.newConfig.playerCols);
    if (tableColChange || playerColChange) postColumnCookie(body.newConfig).then(() => true);

    this.setState({
      modalOpen: false
    });
  }

  render() {
    const { standings } = this.props;
    const refreshLinkUrl = this.props.params.leagueID ? '/standings/' + this.props.params.leagueID : '/standings';

    const sortFunc = (a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints);

    return (
      <div className='standings'>
        <div className="standings--header">Welcome to the new, improved view of Fantasy Premier League</div>
        <div className="standings--content">
          <div>
            <h2>League Information</h2>
            <div className="league-name">{standings.leagueName}</div>
            <div className="col-1-of-2">
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
            <div className="col-1-of-2">
              <a
                className="table-button button"
                onClick={() => {
                  this.setState({modalOpen: true});
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
                  modalOpen={this.state.modalOpen}
                  closeModal={::this.closeModal}
                  tableConfig={this.props.columns.tableCols}
                  listConfig={this.props.columns.playerCols}
                  sortFunc={sortFunc} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ standings, updating, page, columns }) {
  return { standings, updating, page, columns }
}

export default connect(mapStateToProps, { mockFetch })(Standings)
