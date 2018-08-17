import {
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';
import ResourceLoader from './resources';
import { entryType } from './entry';
import { playerType } from './player';
import { classicStyleLeagueInfoType } from './classic-style-league-info';

const numberSort = (a, b) => {
  if (a < b) return -1;
  return b < a ? 1 : 0;
};

export const classicStyleLeagueType = new GraphQLObjectType({
  name: 'classicStyleLeague',
  fields: {
    leagueInfo: { type: classicStyleLeagueInfoType },
    players: { type: new GraphQLList(playerType) },
    entries: { type: new GraphQLList(entryType) },
  },
});

export default class ClassicStyleLeague extends ResourceLoader {
  leagueInfo() {
    return this.classicStyleLeagueInfo();
  }

  entries() {
    if (!this._entries) {
      this._entries = this._getEntries();
    }

    return this._entries;
  }

  async _getEntries() {
    const players = await this.classicStyleStandingsResource.getPlayersInfo(this.args.leagueId);

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
