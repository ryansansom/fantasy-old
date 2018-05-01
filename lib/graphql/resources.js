import Entry from './entry';
import Player from './player';
import ClassicLeagueInfo from './classic-league-info';

export default class ResourceLoader {
  constructor(rootValue) {
    this.args = rootValue.args;
    this.resources = rootValue.resources;

    this._allPlayers = new Map();
    this._allEntries = new Map();
  }

  classicLeagueInfo = () => {
    if (!this._allClassicLeagues) {
      this._allClassicLeagues = new ClassicLeagueInfo(this);
    }

    return this._allClassicLeagues;
  };

  allPlayers = (id) => {
    if (!this._allPlayers.has(id)) {
      this._allPlayers.set(id, new Player(this, id));
    }

    return this._allPlayers.get(id);
  };

  allEntries = (playerInfo) => {
    if (!this._allEntries.has(playerInfo.entry)) {
      this._allEntries.set(playerInfo.entry, new Entry(this, playerInfo));
    }

    return this._allEntries.get(playerInfo.entry);
  };
}
