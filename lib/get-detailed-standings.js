import { getLeaguesClassic } from './fetch-data';
import getPlayers from './get-players';

export default async(leagueID = '', week = '') => {
  const classicLeague = await getLeaguesClassic(leagueID);
  const standings = classicLeague.standings.results;

  const players = standings
    .filter(player => !!player.entry)
    .map(player => formatLeagueEntry(player));

  const abc = await getPlayers(players.map(player => player.entry), week);

  for (let i = 0, len = abc.length; i < len; i++) {
    players[i] = Object.assign(players[i], abc[i]);
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
