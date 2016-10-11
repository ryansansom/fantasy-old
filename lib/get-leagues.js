import { getMyTeam } from './fetch-data';

export default (teamNo, leagueType = '') => {
  let leagueIDs = {};
  let leagueTypeValid = true;
  return getMyTeam(teamNo)
    .then(res => res.leagues)
    .then(leagues => {
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
    })
    .catch(err => err);
}
