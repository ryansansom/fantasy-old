import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { mockRealFetch } from '../../../redux/actions';
import { mockRealAPI } from '../../mock-api';

const pageName = 'Standings';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class Standings extends React.Component {
  static fetchData(dispatch) {
    return mockRealFetch(mockRealAPI(), pageName)(dispatch);
  }

  componentDidMount() {
    document.title = pageName;
    if (this.props.page !== pageName) this.props.mockRealFetch(mockRealAPI(), pageName);
  }

  renderTable() {
    const { players } = this.props.standings;
    const abc = players.map(player => {
      return (<tr key={player.entry}>
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
    return (
      this.props.updating ?
      <span>Updating</span>
      :
      <div className='standings'>
        <div className="standings--header">Welcome to the new, improved view of Fantasy Premier League</div>
        <div className="standings--content">
          <div>
            <h2>League Information</h2>
            <div>{standings.leagueName}</div>
            <div className="table-wrapper">
              {this.renderTable()}
            </div>
          </div>
        </div>
      </div>);
  }
}

function mapStateToProps({ standings, updating, page }) {
  return { standings, updating, page }
}

export default connect(mapStateToProps, { mockRealFetch })(Standings)
