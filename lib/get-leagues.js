import getData from './get-json';

export default (teamNo, leagueType = '') => {
  let leagueIDs = {};
  let leagueTypeValid = true;
  const { leagues } = getData('myteam-' + teamNo);
  const types = Object.keys(leagues);
  let typesArray = [leagueType];
  if (!types.some(type => type === leagueType)) {
    typesArray = types;
    leagueTypeValid = false;
  }
  typesArray.forEach(type => {
    leagueIDs[type] = leagues[type]
      .filter(league => !!league.admin_entry)
      .map(league => league.id);
  });

  return leagueTypeValid ? leagueIDs[leagueType] : leagueIDs;
}
