import { getLeaguesClassic } from './fetch-data';

export default (leagueType = '', leagueID = '') => {
  return getLeaguesClassic(leagueID)
    .then(res => res.standings)
    .then(standings => {
      return standings.results
        .filter(player => !!player.entry)
        .map(player => player.entry);
    })
    .catch(err => err);
}
