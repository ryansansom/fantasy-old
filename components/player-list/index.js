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
    const len = listConfig.length;
    return <div className="header-row">{listConfig.map(({header}, i) => <div key={i} className={`col-1-of-${len} table-header`}>{header}</div>)}</div>;
  }

  renderList() {
    const { players, listConfig } = this.props;
    const len = listConfig.length;

    const playerList = players.picks
      .map((player, i) => {
        return <li key={player.element}>
          {listConfig.map((data, j) => <div key={j} className={`col-1-of-${len} player-picks-format`}>{data.func(player, i)}</div>)}
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
