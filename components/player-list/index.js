import React, { Component, PropTypes } from 'react';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class PlayerList extends Component {
  static propTypes = {
    listConfig: PropTypes.array.isRequired,
    players: PropTypes.object.isRequired
  };

  renderHeader() {
    const { listConfig } = this.props;
    const len = listConfig.reduce((prev, curr) => prev + (curr.colSpan ? curr.colSpan : 1), 0);
    return <div className="header-row">{listConfig.map(({header, colSpan}, i) => <div key={i} className={`col-${colSpan || 1}-of-${len} table-header`}>{header}</div>)}</div>;
  }

  renderList(players) {
    const { listConfig } = this.props;
    const len = listConfig.reduce((prev, curr) => prev + (curr.colSpan ? curr.colSpan : 1), 0);

    const playerList = players
      .map((player, i) => {
        return <li key={player.element}>
          {listConfig.map(({func, colSpan}, j) => <div key={j} className={`col-${colSpan || 1}-of-${len} player-picks-format`}>{func(player, i)}</div>)}
        </li>;
      });

    return <ul className="table-list">
      {playerList}
    </ul>;
  }

  render() {
    const { players: { picks, subs } } = this.props;
    return (
      <div className="player-picks">
        <h3 className="list-header">Players</h3>
        {this.renderHeader()}
        {this.renderList(picks)}

        <h3 className="list-header">Subs</h3>
        {this.renderHeader()}
        {this.renderList(subs)}
      </div>
    );
  }
}

export default PlayerList;
