import React, { Component, PropTypes } from 'react';

class PlayerList extends Component {
  static propTypes = {
    players: PropTypes.object.isRequired
  };

  getPlayers(players, subs) {
    return players.map(player => {
      return <li key={player.element}>
        <div className="col-1-of-2 player-picks-format">{player.name}</div>
        <div className="col-1-of-2 player-picks-format">{player.points * player.multiplier}</div>
      </li>
    })
  }

  render() {
    const { players } = this.props;

    return (
      <div className="player-picks">
        <div className="header-row">
          <div className="col-1-of-2 table-header">Player</div>
          <div className="col-1-of-2 table-header">Points</div>
        </div>
        <ul className="table-list">
          {this.getPlayers(players.picks, players.subs)}
        </ul>
      </div>
    );
  }
}

export default PlayerList;
