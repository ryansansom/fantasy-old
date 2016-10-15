import { getEntry, getMe } from './fetch-data';

export default (teamID = null) => {
  if (teamID) {
    return getLeaguesById(teamID);
  } else {
    return getMe()
      .then(res => {
        return getLeaguesById(res.entry.id);
      })
      .catch(err => err);
  }
}

async function getLeaguesById(id) {
  const { entry, leagues } = await getEntry(id);

  for (var type in leagues) {
    if (leagues.hasOwnProperty(type)) {
      leagues[type] = leagues[type]
        .filter(league => !!league.admin_entry)
        .map(league => formatLeague(league));
    }
  }

  return {
    entry: formatEntry(entry),
    leagues
  };
}

function formatEntry(entry) {
  return {
    id: entry.id,
    team_name: entry.name,
    player_name: `${entry.player_first_name} ${entry.player_last_name}`
  };
}

function formatLeague(league) {
  return {
    id: league.id,
    name: league.name
  };
}
