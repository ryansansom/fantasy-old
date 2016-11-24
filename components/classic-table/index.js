import Accordion from '../accordion';
import PlayerList from '../player-list';
import React, { Component, PropTypes } from 'react';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class ClassicTable extends Component {
  static propTypes = {
    entries: PropTypes.array.isRequired,
    sortFunc: PropTypes.func,
    tableConfig: PropTypes.array.isRequired
  };

  static defaultProps = {
    sortFunc: (a, b) => (b.prevTotal + b.projectedPoints) - (a.prevTotal + a.projectedPoints)
  };

  renderHeader() {
    const len = this.props.tableConfig.length;
    return <div className="header-row">{this.props.tableConfig.map(({header}, i) => <div key={i} className={`col-1-of-${len} table-header table-format`}>{header}</div>)}</div>;
  }

  renderList() {
    const { entries, sortFunc, tableConfig } = this.props;
    const len = tableConfig.length;

    const playerListConfig = [
      {header: 'Position', func: (player) => {
        switch (player.element_type) {
          case 1:
            return 'GK';
          case 2:
            return 'DEF';
          case 3:
            return 'MID';
          case 4:
            return 'FWD';
        }
      }},
      {header: 'Player', func: (player) => {
        let appendName = '';
        if (player.is_captain) {
          appendName = ' (C)';
        } else if (player.is_vice_captain) {
          appendName = ' (V)';
        }

        return player.name + appendName;
      }},
      {header: 'Points', func: (player) => player.points * player.multiplier},
      {header: 'Bonus Points', func: (player) => {
        if (player.game_points_finalised) {
          return player.actual_bonus > 0 ? player.actual_bonus + ' (incl.)' : 0;
        } else {
          return player.provisional_bonus;
        }
      }}
    ];

    const entryList = entries
      .sort(sortFunc)
      .map((entry, i) => {
        const entryRow = <div>
          {tableConfig.map((data, j) => <div key={j} className={`col-1-of-${len} table-format`}>{data.func(entry, i)}</div>)}
        </div>;

        return (
          <Accordion
            tag="li"
            key={entry.entry}
            classes="entry-li"
            title={entry.entry.toString()}
            header={entryRow}>
            <PlayerList players={entry.players} listConfig={playerListConfig} />
          </Accordion>
        )
      });
    return (
      <ul className="table-list">
        {entryList}
      </ul>
    );
  }

  render() {
    return (
      <div className="classic-standings">
        { this.renderHeader() }
        { this.renderList() }
      </div>
    );
  }
}

export default ClassicTable;
