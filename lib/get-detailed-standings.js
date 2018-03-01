import { applyPoints } from './helpers/get-team-points';
import { precisionRound } from './helpers/precision-round';
import { getLeaguesClassic } from './fetch-data';
import getPlayersWithTotal from './get-new-total';
import getWeek from './get-week';

function formatLeagueEntry(player) {
  return {
    entry: player.entry,
    team_name: player.entry_name,
    player_name: player.player_name,
  };
}

export default async (leagueID = '', week = '') => {
  const [weekData, classicLeague] = await Promise.all([getWeek(week), getLeaguesClassic(leagueID)]);
  const { league } = classicLeague;
  const standings = classicLeague.standings.results;

  const players = standings
    .filter(player => !!player.entry)
    .map(player => formatLeagueEntry(player));

  const playerDetails = await getPlayersWithTotal(players.map(player => player.entry), weekData);

  for (let i = 0, len = playerDetails.length; i < len; i++) {
    const player = players[i];
    Object.assign(player, playerDetails[i]);
    player.currentPoints = applyPoints(player);
    player.ep_this = precisionRound(applyPoints(player, 0, false, false, 'ep_this'), 1);
    player.ep_next = precisionRound(applyPoints(player, 0, false, false, 'ep_next'), 1);
    player.projectedPoints = applyPoints(player, 0, true, true);
  }

  return {
    leagueId: league.id,
    leagueName: league.name,
    lastUpdated: Date.now(),
    gwEnded: weekData.finished && weekData.data_checked,
    players,
  };
};
