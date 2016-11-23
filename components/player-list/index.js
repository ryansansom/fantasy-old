import React, { Component, PropTypes } from 'react';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class PlayerList extends Component {
  static propTypes = {
    players: PropTypes.object.isRequired
  };

  applyCaptainStatus({ is_captain, is_vice_captain, name }) {
    let appendName = '';
    if (is_captain) {
      appendName = ' (C)';
    } else if (is_vice_captain) {
      appendName = ' (V)';
    }

    return name + appendName;
  }

  getPlayers(players, subs) {
    return players.map(player => {
      return <li key={player.element}>
        <div className="col-1-of-2 player-picks-format">{this.applyCaptainStatus(player)}</div>
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
