import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mockFetch } from '../../../redux/actions';
import { mockRealAPI } from '../../mock-api';
import { getStandings } from '../../../lib/internal-api';
import ClassicTable from '../../classic-table';
import * as classicTableConfig from '../../../lib/table-config/classic-table';
import * as playerListConfig from '../../../lib/table-config/player-list';
import ColumnModal from '../../modals/column-configuration';

const pageName = 'Standings';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class Standings extends Component {
  static fetchData(dispatch, { leagueID }) {
    return mockFetch(leagueID ? getStandings(leagueID) : mockRealAPI(), pageName, true)(dispatch);
  }

  static defaultProps = {
    sortFunc: (a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints),
    tableConfig: [
      classicTableConfig.position,
      classicTableConfig.playerName,
      classicTableConfig.prevTotal,
      classicTableConfig.currPoints,
      classicTableConfig.projPoints,
      classicTableConfig.currTotal,
      classicTableConfig.projTotal
    ],
    listConfig: [
      playerListConfig.position,
      playerListConfig.playerName,
      playerListConfig.playerPoints,
      playerListConfig.bonusPoints
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      listConfig: props.listConfig,
      modalOpen: false,
      tableConfig: props.tableConfig
    };
  }

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) this.props.mockFetch(this.props.params.leagueID ? getStandings(this.props.params.leagueID) : mockRealAPI(), pageName, true)
  }

  onTableConfigChange(e) {
    const { tableConfig } = this.state;
    const columnIndex = tableConfig.findIndex(cfg => cfg.header === classicTableConfig[e.target.value].header);
    if (columnIndex > -1) {
      e.target.checked = true;
      tableConfig.splice(columnIndex, 1);
      this.setState({
        tableConfig
      });
    } else {
      e.target.checked = false;
      tableConfig.push(classicTableConfig[e.target.value]);
      this.setState({
        tableConfig
      });
    }
  }

  onListConfigChange(e) {
    const { listConfig } = this.state;
    const columnIndex = listConfig.findIndex(cfg => cfg.header === playerListConfig[e.target.value].header);
    if (columnIndex > -1) {
      e.target.checked = true;
      listConfig.splice(columnIndex, 1);
      this.setState({
        listConfig
      });
    } else {
      e.target.checked = false;
      listConfig.push(playerListConfig[e.target.value]);
      this.setState({
        listConfig
      });
    }
  }

  closeModal() {
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
                  tableConfig={this.state.tableConfig}
                  listConfig={this.state.listConfig}
                  sortFunc={sortFunc} />}
            </div>
          </div>
        </div>
        {this.state.modalOpen ? <ColumnModal
          closeModal={::this.closeModal}
          onTableConfigChange={::this.onTableConfigChange}
          onListConfigChange={::this.onListConfigChange}
          listConfig={this.state.listConfig}
          tableConfig={this.state.tableConfig}/> : null}
      </div>
    );
  }
}

function mapStateToProps({ standings, updating, page }) {
  return { standings, updating, page }
}

export default connect(mapStateToProps, { mockFetch })(Standings)
