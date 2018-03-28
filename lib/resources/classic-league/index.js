export class ClassicLeague {
  constructor(rootValue) {
    this.classicLeagueLoader = rootValue.loaders.classicLeagueLoader;
  }

  leagueId = leagueId => leagueId;

  async leagueName(leagueId) {
    const leagueStandings = await this.classicLeagueLoader.load(leagueId);

    return leagueStandings.league.name;
  }

  lastUpdated = () => Date.now(); // TODO: Change this to resolve at the end of all requests

  async players(leagueId) {
    const leagueStandings = await this.classicLeagueLoader.load(leagueId);

    return leagueStandings.standings.results.map(player => player.id);
  }
}
