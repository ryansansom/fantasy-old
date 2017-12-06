import { getEntry, getMe } from './fetch-data';

function formatEntry(entry) {
  return {
    id: entry.id,
    team_name: entry.name,
    player_name: `${entry.player_first_name} ${entry.player_last_name}`,
  };
}

function formatLeague(league) {
  return {
    id: league.id,
    name: league.name,
  };
}

async function getLeaguesById(id) {
  const { entry, leagues: rawLeagues } = await getEntry(id);

  const leagues = Object.keys(rawLeagues).reduce((formattedLeagues, leagueType) => {
    formattedLeagues[leagueType] = rawLeagues[leagueType]
      .filter(league => !!league.admin_entry)
      .map(league => formatLeague(league));

    return formattedLeagues;
  }, {});

  return {
    entry: formatEntry(entry),
    leagues,
  };
}

export default (teamID = null) => {
  if (teamID) {
    return getLeaguesById(teamID);
  }
  return getMe()
    .then(res => getLeaguesById(res.entry.id))
    .catch(err => err);
};
