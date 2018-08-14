import {
  GraphQLObjectType,
  GraphQLList,
} from 'graphql';
import ResourceLoader from './resources';
import { entryType } from './entry';
import { playerType } from './player';
import { draftLeagueInfoType } from './draft-league-info';

const numberSort = (a, b) => {
  if (a < b) return -1;
  return b < a ? 1 : 0;
};

export const draftLeagueType = new GraphQLObjectType({
  name: 'draftLeague',
  fields: {
    leagueInfo: { type: draftLeagueInfoType },
    players: { type: new GraphQLList(playerType) },
    entries: { type: new GraphQLList(entryType) },
  },
});

export default class DraftLeague extends ResourceLoader {
  leagueInfo() {
    return this.draftLeagueInfo();
  }

  entries() {
    if (!this._entries) {
      this._entries = this._getEntries();
    }

    return this._entries;
  }

  async _getEntries() {
    const players = await this.resources.draftLeagueStandings.getPlayersInfo(this.args.leagueId);
    const standings = await this.resources.draftLeagueStandings.getStandings(this.args.leagueId);

    const previousTotals = standings.reduce((prev, curr) => {
      prev[curr.league_entry] = curr.total - curr.event_total;
      return prev;
    }, {});

    return players.map(playerInfo => this.allEntries({
      entry: playerInfo.entry_id,
      player_name: `${playerInfo.player_first_name} ${playerInfo.player_last_name}`,
      entry_name: playerInfo.entry_name,
      previousTotal: previousTotals[playerInfo.id],
    }));
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
