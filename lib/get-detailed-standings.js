import { getLeaguesClassic } from './fetch-data';
import getPlayersWithTotal from './get-new-total';

export default async(leagueID = '', weekData = {}) => {
  const classicLeague = await getLeaguesClassic(leagueID);
  const standings = classicLeague.standings.results;

  const players = standings
    .filter(player => !!player.entry)
    .map(player => formatLeagueEntry(player));

  const playerDetails = await getPlayersWithTotal(players.map(player => player.entry), weekData);

  for (let i = 0, len = playerDetails.length; i < len; i++) {
    players[i] = Object.assign(players[i], playerDetails[i]);
  }

  return players;
}

function formatLeagueEntry(player) {
  return {
    entry: player.entry,
    team_name: player.entry_name,
    player_name: player.player_name
  }
}
