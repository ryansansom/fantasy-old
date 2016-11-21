import React, { Component } from 'react';
import { connect } from 'react-redux';
import { mockFetch } from '../../../redux/actions';
import { mockRealAPI } from '../../mock-api';
import { getStandings } from '../../../lib/internal-api';

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

  renderTable() {
    const { players } = this.props.standings;
    const heading = <li key="header" className="header-row">
      <div className="col-1-of-7 table-header table-format">Position</div>
      <div className="col-1-of-7 table-header table-format">Player</div>
      <div className="col-1-of-7 table-header table-format">Previous Total</div>
      <div className="col-1-of-7 table-header table-format">Current Points</div>
      <div className="col-1-of-7 table-header table-format">Projected Points</div>
      <div className="col-1-of-7 table-header table-format">Current Total</div>
      <div className="col-1-of-7 table-header table-format">Projected Total</div>
    </li>;
    const newList = players
      .sort((a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints))
      .map((player, i) => {
        return (
          <li key={player.entry} className="data-row">
            <div className="col-1-of-7 table-format">{i + 1}</div>
            <div className="col-1-of-7 table-format">{player.player_name}</div>
            <div className="col-1-of-7 table-format">{player.prevTotal}</div>
            <div className="col-1-of-7 table-format">{player.currentPoints}</div>
            <div className="col-1-of-7 table-format">{player.projectedPoints}</div>
            <div className="col-1-of-7 table-format">{player.prevTotal + player.currentPoints}</div>
            <div className="col-1-of-7 table-format">{player.prevTotal + player.projectedPoints}</div>
          </li>
        )
      });
    return (
      <ul className="player-list">
        {heading}
        {newList}
      </ul>
    );
  }

  render() {
    const { standings } = this.props;
    const refreshLinkUrl = this.props.params.leagueID ? '/standings/' + this.props.params.leagueID : '/standings';
    return (
      <div className='standings'>
        <div className="standings--header">Welcome to the new, improved view of Fantasy Premier League</div>
        <div className="standings--content">
          <div>
            <h2>League Information</h2>
            <div className="league-name">{standings.leagueName}</div>
            <a
              className="refresh-results"
              onClick={e => {
                e.preventDefault();
                return this.props.mockFetch(this.props.params.leagueID ? getStandings(this.props.params.leagueID) : mockRealAPI(), pageName, true);
              }}
              href={refreshLinkUrl}>Refresh</a>
            <div className="table-wrapper">
              {this.props.updating ? <span>Updating...</span> : this.renderTable()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps({ standings, updating, page }) {
  return { standings, updating, page }
}

export default connect(mapStateToProps, { mockFetch })(Standings)
