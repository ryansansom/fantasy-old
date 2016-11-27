import React, { Component, PropTypes } from 'react';
import { getLength } from '../../lib/table-config/helpers';
import * as listConfig from '../../lib/table-config/player-list';

if (process.env.CLIENT_RENDER) {
  require('./styles.less')
}

class PlayerList extends Component {
  static propTypes = {
    listConfig: PropTypes.array.isRequired,
    players: PropTypes.object.isRequired
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

  onChange(e) {
    const columnIndex = this.state.listConfig.findIndex(cfg => cfg.header === listConfig[e.target.value].header);
    if (columnIndex > -1) {
      e.target.checked = true;
      this.state.listConfig.splice(columnIndex, 1);
      this.setState({
        listConfig: this.state.listConfig
      });
    } else {
      e.target.checked = false;
      this.state.listConfig.push(listConfig[e.target.value]);
      this.setState({
        listConfig: this.state.listConfig
      });
    }
  }

  renderFilters() {
    const columnContent = Object.keys(listConfig).map(key => {
      const columnConfig = listConfig[key];
      return <label key={key}>
        {columnConfig.header}
        <input type="checkbox" onChange={::this.onChange} value={key} checked={!!this.state.listConfig.find(cfg => cfg.header === columnConfig.header)} />
      </label>
    });
    return (
      <div>
        {columnContent}
      </div>
    );
  }

  render() {
    const { players: { picks, subs } } = this.props;
    return (
      <div className="player-picks">
        {this.renderFilters()}
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
