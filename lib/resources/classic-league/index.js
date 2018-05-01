export class ClassicLeague {
  constructor(rootValue) {
    this.classicLeagueLoader = rootValue.loaders.classicLeagueLoader;
  }

  leagueId = leagueId => leagueId;

  async leagueName(leagueId) {
    const leagueStandings = await this.classicLeagueLoader.load(leagueId);

    return leagueStandings.league.name;
  }

  async playerIds(leagueId) {
    const rawPlayers = await this.getPlayersInfo(leagueId);

    return rawPlayers.map(player => player.id);
  }

  async getPlayersInfo(leagueId) {
    const leagueStandings = await this.classicLeagueLoader.load(leagueId);

    return leagueStandings.standings.results;
  }
}
