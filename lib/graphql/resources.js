import Entry from './entry';
import Player from './player';
import ClassicStyleLeagueInfo from './classic-style-league-info';

export default class ResourceLoader {
  constructor(rootValue) {
    this.args = rootValue.args;
    this.resources = rootValue.resources;
    this.draft = rootValue.draft;

    this.picksResource = rootValue.args.draft
      ? this.resources.draftPicks
      : this.resources.entryPicks;

    this.classicStyleStandingsResource = rootValue.args.draft
      ? this.resources.draftLeagueStandings
      : this.resources.classicLeagueStandings;

    this._allPlayers = new Map();
    this._allEntries = new Map();
  }

  classicStyleLeagueInfo = () => {
    if (!this._allClassicStyleLeagues) {
      this._allClassicStyleLeagues = new ClassicStyleLeagueInfo(this);
    }

    return this._allClassicStyleLeagues;
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
