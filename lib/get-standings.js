import { getLeaguesClassic } from './fetch-data';

// TODO: Duplicate?
function formatLeagueEntry(player) {
  return {
    entry: player.entry,
    team_name: player.entry_name,
    player_name: player.player_name,
  };
}

export default async (leagueID = '') => {
  const classicLeague = await getLeaguesClassic(leagueID);
  const standings = classicLeague.standings.results;

  return standings
    .filter(player => !!player.entry)
    .map(player => formatLeagueEntry(player));
};
