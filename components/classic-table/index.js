import Accordion from '../accordion';
import PlayerList from '../player-list';
import React, { Component, PropTypes } from 'react';

class ClassicTable extends Component {
  static propTypes = {
    players: PropTypes.array.isRequired,
    sortFunc: PropTypes.func,
    tableConfig: PropTypes.array.isRequired
  };

  static defaultProps = {
    sortFunc: (a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints)
  };

  renderHeader() {
    const len = this.props.tableConfig.length;
    return <div className="header-row">{this.props.tableConfig.map((data, i) => <div key={i} className={`col-1-of-${len} table-header table-format`}>{data.header}</div>)}</div>;
  }

  renderList() {
    const { players, sortFunc, tableConfig } = this.props;
    const len = tableConfig.length;

    const playerList = players
      .sort(sortFunc)
      .map((player, i) => {
        const playerRow = <div>
          {tableConfig.map((data, j) => <div key={j} className={`col-1-of-${len} table-format`}>{data.func(player, i)}</div>)}
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
      <ul className="player-list">
        {playerList}
      </ul>
    );
  }

  render() {
    return (
      <div>
        { this.renderHeader() }
        { this.renderList() }
      </div>
    );
  }
}

export default ClassicTable;
