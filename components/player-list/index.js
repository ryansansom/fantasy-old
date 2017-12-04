import React, { Component, PropTypes } from 'react';
import { getLength } from '../../lib/table-config/helpers';
import * as config from '../../lib/table-config/player-list';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

class PlayerList extends Component {
  static propTypes = {
    listConfig: PropTypes.array,
    players: PropTypes.object.isRequired,
  };

  static defaultProps = {
    listConfig: [
      config.position,
      config.playerName,
      config.playerPoints,
      config.bonusPoints,
    ],
  };

  renderHeader() {
    const { listConfig } = this.props;
    const len = getLength(listConfig);
    return (
      <div className="header-row">
        {listConfig.map(({ header, colSpan }, i) => <div key={i} className={`col-${colSpan || 1}-of-${len} table-header`}>{header}</div>)}
      </div>
    );
  }

  renderList(players) {
    const { listConfig } = this.props;
    const len = getLength(listConfig);

    const playerList = players
      .map((player, i) => (
        <li key={player.element}>
          {listConfig.map(({ func, colSpan }, j) => <div key={j} className={`col-${colSpan || 1}-of-${len} player-picks-format`}>{func(player, i)}</div>)}
        </li>
      ));

    return (
      <ul className="table-list">
        {playerList}
      </ul>
    );
  }

  render() {
    const { players: { picks, subs } } = this.props;
    return (
      <div className="player-picks">
        {picks.length > 0
          ? (
            <div>
              <h3 className="list-header">Players</h3>
              {this.renderHeader()}
              {this.renderList(picks)}
            </div>
          )
          : null}

        {subs && subs.length > 0
          ? (
            <div>
              <h3 className="list-header">Subs</h3>
              {this.renderHeader()}
              {this.renderList(subs)}
            </div>
          )
          : null}
      </div>
    );
  }
}

export default PlayerList;
