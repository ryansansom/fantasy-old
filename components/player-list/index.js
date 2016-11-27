import React, { Component, PropTypes } from 'react';
import ColumnFilters from '../column-filters';
import { getLength } from '../../lib/table-config/helpers';
import * as config from '../../lib/table-config/player-list';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class PlayerList extends Component {
  static propTypes = {
    listConfig: PropTypes.array,
    players: PropTypes.object.isRequired
  };

  static defaultProps = {
    listConfig: [
      config.position,
      config.playerName,
      config.playerPoints,
      config.bonusPoints
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      listConfig: props.listConfig
    };
  }

  renderHeader() {
    const { listConfig } = this.state;
    const len = getLength(listConfig);
    return <div className="header-row">
      {listConfig.map(({header, colSpan}, i) => <div key={i} className={`col-${colSpan || 1}-of-${len} table-header`}>{header}</div>)}
    </div>;
  }

  renderList(players) {
    const { listConfig } = this.state;
    const len = getLength(listConfig);

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

  onFilterChange(e) {
    const { listConfig } = this.state;
    const columnIndex = listConfig.findIndex(cfg => cfg.header === config[e.target.value].header);
    if (columnIndex > -1) {
      e.target.checked = true;
      listConfig.splice(columnIndex, 1);
      this.setState({
        listConfig
      });
    } else {
      e.target.checked = false;
      listConfig.push(config[e.target.value]);
      this.setState({
        listConfig
      });
    }
  }

  render() {
    const { players: { picks, subs } } = this.props;
    return (
      <div className="player-picks">
        <ColumnFilters
          config={config}
          listConfig={this.state.listConfig}
          toggle={::this.onFilterChange} />

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
