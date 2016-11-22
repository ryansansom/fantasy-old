import Accordion from '../accordion';
import PlayerList from '../player-list';
import React, { Component, PropTypes } from 'react';

class ClassicTable extends Component {
  static propTypes = {
    players: PropTypes.array.isRequired
  };

  render() {
    const { players } = this.props;
    const playerList = players
      .sort((a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints))
      .map((player, i) => {
        const playerRow = <div>
          <div className="col-1-of-7 table-format">{i + 1}</div>
          <div className="col-1-of-7 table-format">{player.player_name}</div>
          <div className="col-1-of-7 table-format">{player.prevTotal}</div>
          <div className="col-1-of-7 table-format">{player.currentPoints}</div>
          <div className="col-1-of-7 table-format">{player.projectedPoints}</div>
          <div className="col-1-of-7 table-format">{player.prevTotal + player.currentPoints}</div>
          <div className="col-1-of-7 table-format">{player.prevTotal + player.projectedPoints}</div>
        </div>;

        return (
          <Accordion
            tag="li"
            key={player.entry}
            classes="entry-li"
            title={player.entry.toString()}
            header={playerRow}>
            <PlayerList players={player.players} />
          </Accordion>
        )
      });

    return (
      <div>
        <div className="header-row">
          <div className="col-1-of-7 table-header table-format">Position</div>
          <div className="col-1-of-7 table-header table-format">Player</div>
          <div className="col-1-of-7 table-header table-format">Previous Total</div>
          <div className="col-1-of-7 table-header table-format">Current Points</div>
          <div className="col-1-of-7 table-header table-format">Projected Points</div>
          <div className="col-1-of-7 table-header table-format">Current Total</div>
          <div className="col-1-of-7 table-header table-format">Projected Total</div>
        </div>
        <ul className="player-list">
          {playerList}
        </ul>
      </div>
    );
  }
}

export default ClassicTable;
