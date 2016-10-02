import getData from './get-json';

export default (leagueType = '', leagueID = '') => {
  const { standings } = getData(`leagues-${leagueType}-standings-${leagueID}`);

  return standings.results
    .filter(player => !!player.entry)
    .map(player => player.entry);
}
