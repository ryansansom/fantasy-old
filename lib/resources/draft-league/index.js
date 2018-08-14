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
    const leagueStandings = await this.draftLeagueLoader.load(leagueId);

    return leagueStandings.league_entries;
  }

  async getStandings(leagueId) {
    const leagueStandings = await this.draftLeagueLoader.load(leagueId);

    return leagueStandings.standings;
  }
}
