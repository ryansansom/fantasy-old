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

  renderList() {
    const { players, listConfig } = this.props;
    const len = listConfig.reduce((prev, curr) => prev + (curr.colSpan ? curr.colSpan : 1), 0);

    const playerList = players.picks
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
    return (
      <div className="player-picks">
        {this.renderHeader()}
        {this.renderList()}
      </div>
    );
  }
}

export default PlayerList;
