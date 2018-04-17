import RootValue from './base';

export default class ClassicLeagueInfo extends RootValue {
  id() {
    return this.resources.classicLeagueStandings.leagueId(this.args.leagueId);
  }

  leagueName() {
    return this.resources.classicLeagueStandings.leagueName(this.args.leagueId);
  }

  gameweekEnded() {
    return this.resources.events.gwEnded(this.args.week);
  }

  lastUpdated = () => Date.now(); // TODO: Change this to resolve at the end of all requests
}
