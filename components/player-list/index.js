import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getLength } from '../../lib/table-config/helpers';
import * as playerListConfig from '../../lib/table-config/player-list';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

class PlayerList extends Component {
  static propTypes = {
    listConfig: PropTypes.arrayOf(PropTypes.object),
    players: PropTypes.shape({
      picks: PropTypes.arrayOf(PropTypes.object).isRequired,
      subs: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  };

  static defaultProps = {
    listConfig: [
      playerListConfig.position,
      playerListConfig.playerName,
      playerListConfig.playerPoints,
      playerListConfig.bonusPoints,
    ],
  };

  shouldComponentUpdate(nextProps) {

    Object.keys(nextProps).forEach(key => console.log(key, nextProps[key] === this.props[key]));

    return true;
  }

  renderHeader() {
    const { listConfig } = this.props;
    const len = getLength(listConfig);
    return (
      <div className="header-row">
        {listConfig.map(({ header, colSpan }) => <div key={header} className={`col-${colSpan || 1}-of-${len} table-header`}>{header}</div>)}
      </div>
    );
  }

  renderList(players) {
    const { listConfig } = this.props;
    const len = getLength(listConfig);

    const playerList = players
      .map((player, i) => (
        <li key={player.element}>
          {listConfig.map(({ header, func, colSpan }) => <div key={header} className={`col-${colSpan || 1}-of-${len} player-picks-format`}>{func(player, i)}</div>)}
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

function buildConfigFromProps(config, arr) { // Ahhh not the same state, help, selector/reselect???
  if (arr[0] && arr[0].func) return arr;
  return arr.map((cfg) => {
    const matchKey = Object.keys(config).find(cfgKey => config[cfgKey].header === cfg.header);
    return config[matchKey];
  });
}

const mapStateToProps = ({ playerCols }) => ({
  playerCols,
  listConfig: buildConfigFromProps(playerListConfig, playerCols),
});

export default connect(mapStateToProps)(PlayerList);
