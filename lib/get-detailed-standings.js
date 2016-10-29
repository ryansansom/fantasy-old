import { getLeaguesClassic } from './fetch-data';
import getPlayersWithTotal from './get-new-total';
import getWeek from './get-week';

export default async(leagueID = '', week = '') => {
  const [ weekData, classicLeague ] = await Promise.all([getWeek(week), getLeaguesClassic(leagueID)]);
  const { league } = classicLeague;
  const standings = classicLeague.standings.results;

  const players = standings
    .filter(player => !!player.entry)
    .map(player => formatLeagueEntry(player));

  const playerDetails = await getPlayersWithTotal(players.map(player => player.entry), weekData);

  for (let i = 0, len = playerDetails.length; i < len; i++) {
    // I think this can change to a forEach as Object assign overrides dest value
    players[i] = Object.assign(players[i], playerDetails[i]);
  }

  return {
    leagueId: league.id,
    leagueName: league.name,
    players
  };
}

function formatLeagueEntry(player) {
  return {
    entry: player.entry,
    team_name: player.entry_name,
    player_name: player.player_name
  }
}
