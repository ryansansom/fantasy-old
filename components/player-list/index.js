import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from '../../redux/connect-deep-compare';
import PlayerListHeader from './header';
import PlayerLine from './player-line';
import { getPlayers } from '../../redux/reducers';

if (process.env.CLIENT_RENDER) {
  require('./styles.less');
}

class PlayerList extends Component {
  static propTypes = {
    entryId: PropTypes.number.isRequired,
    leagueId: PropTypes.string.isRequired,
    players: PropTypes.shape({
      picks: PropTypes.arrayOf(PropTypes.object).isRequired,
      subs: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  };

  renderList(players) {
    const playerList = players
      .map(player => (
        <PlayerLine
          key={player.element}
          entryId={this.props.entryId}
          leagueId={this.props.leagueId}
          playerId={player.element}
        />
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
              <PlayerListHeader />
              {this.renderList(picks)}
            </div>
          )
          : null}

        {subs && subs.length > 0
          ? (
            <div>
              <h3 className="list-header">Subs</h3>
              <PlayerListHeader />
              {this.renderList(subs)}
            </div>
          )
          : null}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  players: getPlayers(state, ownProps),
});

export default connect(mapStateToProps)(PlayerList);
