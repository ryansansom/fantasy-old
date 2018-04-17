import {
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';
import ResourceLoader from './resources';
import { entryType } from './entry';
import { playerType } from './player';
import { classicLeagueInfoType } from './classic-league-info';

const numberSort = (a, b) => {
  if (a < b) return -1;
  return b < a ? 1 : 0;
};

export const classicLeagueType = new GraphQLObjectType({
  name: 'classicLeague',
  fields: {
    leagueInfo: { type: classicLeagueInfoType },
    players: { type: new GraphQLList(playerType) },
    entries: { type: new GraphQLList(entryType) },
  },
});

export default class ClassicLeague extends ResourceLoader {
  leagueInfo() {
    return this.classicLeagueInfo();
  }

  entries() {
    if (!this._entries) {
      this._entries = this._getEntries();
    }

    return this._entries;
  }

  async _getEntries() {
    const players = await this.resources.classicLeagueStandings.getPlayersInfo(this.args.leagueId);

    return players.map(playerInfo => this.allEntries(playerInfo));
  }

  async playerIds() {
    const entries = await this.entries();
    const newEntries = await Promise.all(entries.map(async entry => (await entry.players()).map(player => player.element)));
    const rawPicks = newEntries.reduce((flattenedArray, currentValue) => flattenedArray.concat(currentValue), []);

    return Array.from(new Set(rawPicks))
      .sort(numberSort);
  }

  async players() {
    const picks = await this.playerIds();

    return picks.map(id => this.allPlayers(id));
  }
}
