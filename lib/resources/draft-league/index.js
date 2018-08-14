export class DraftLeague {
  constructor(rootValue) {
    this.draftLeagueLoader = rootValue.loaders.draftLeagueLoader;
  }

  leagueId = leagueId => leagueId;

  async leagueName(leagueId) {
    const leagueStandings = await this.draftLeagueLoader.load(leagueId);

    return leagueStandings.league.name;
  }

  async playerIds(leagueId) {
    const rawPlayers = await this.getPlayersInfo(leagueId);

    return rawPlayers.map(player => player.id);
  }

  async getPlayersInfo(leagueId) {
    const { league_entries: entries, standings } = await this.draftLeagueLoader.load(leagueId);

    const previousTotals = standings.reduce((prev, curr) => {
      prev[curr.league_entry] = curr.total - curr.event_total;
      return prev;
    }, {});

    return entries.map(entry => ({
      entry: entry.entry_id,
      player_name: `${entry.player_first_name} ${entry.player_last_name}`,
      entry_name: entry.entry_name,
      previousTotal: previousTotals[entry.id],
    }));
  }

  async getStandings(leagueId) {
    const leagueStandings = await this.draftLeagueLoader.load(leagueId);

    return leagueStandings.standings;
  }
}
