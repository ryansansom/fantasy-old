import { getEntry, getMe, getMyTeam } from './fetch-data';

export default (leagueType = '', teamID = null) => {
  let leagueIDs = {};
  let leagueTypeValid = true;
  if (teamID) {
    return getLeaguesById(getEntry, teamID, leagueIDs, leagueType, leagueTypeValid);
  } else {
    return getMe()
      .then(res => {
        return getLeaguesById(getMyTeam, res.entry.id, leagueIDs, leagueType, leagueTypeValid);
      })
      .catch(err => err);
  }
}

function getLeaguesById(method, id, leagueIDs, leagueType, leagueTypeValid) {
  return method(id)
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
