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
    const abc = players
      .sort((a, b) => (b.prevTotal + b.currentPoints) - (a.prevTotal + a.currentPoints)) // Change when projected becomes optional
      .map((player, i) => {
      return (<tr key={player.entry}>
        <td>{i + 1}</td>
        <td>{player.player_name}</td>
        <td>{player.prevTotal}</td>
        <td>{player.currentPoints}</td>
        <td>{player.projectedPoints}</td>
        <td>{player.prevTotal + player.currentPoints}</td>
        <td>{player.prevTotal + player.projectedPoints}</td>
      </tr>)
    });

    return (<table>
      <thead>
        <tr>
          <th>Position</th>
          <th>Player</th>
          <th>Previous Total</th>
          <th>Current Points</th>
          <th>Projected Points</th>
          <th>Current Total</th>
          <th>Projected Total</th>
        </tr>
      </thead>
      <tbody>{abc}</tbody>
    </table>)
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
