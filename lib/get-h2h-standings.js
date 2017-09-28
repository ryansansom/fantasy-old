import { applyPoints } from './helpers/get-team-points';
import { getLeaguesH2H } from './fetch-data';
import getPlayersWithTotal from './get-new-total';
import getWeek from './get-week';

export default async(leagueID = '', week = '') => {
  const [
    weekData,
    { league, standings: { results: standings }, matches_this: { results: matches } = {} }
  ] = await Promise.all([getWeek(week), getLeaguesH2H(leagueID)]);

  const players = standings
    .filter(player => !!player.entry)
    .map(player => formatLeagueEntry(player));

  const playerDetails = await getPlayersWithTotal(players.map(player => player.entry), weekData);

  for (let i = 0, len = playerDetails.length; i < len; i++) {
    const player = players[i];
    Object.assign(player, playerDetails[i]);
    player.currentPoints = applyPoints(player);
    player.projectedPoints = applyPoints(player, 0, true, true);
  }

  const abc = {
    leagueId: league.id,
    leagueName: league.name,
    leagueType: 'h',
    gw_ended: weekData.finished && weekData.data_checked,
    matches: matches.map(match => {
      return {
        team1: match.entry_1_entry,
        team2: match.entry_2_entry,
      };
    }),
    players
  };

  console.log('RS2017', require('util').inspect(abc, { depth: null }));
  return abc;
}

function formatLeagueEntry(player) {
  return {
    entry: player.entry,
    team_name: player.entry_name,
    player_name: player.player_name
  }
}
