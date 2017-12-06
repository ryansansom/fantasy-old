import { getEntryPicks } from './fetch-data';
import getPlayers from './get-players';

export default async (teamIDs = [], weekData = {}) => {
  const { id: week } = weekData;
  let totalPoints;
  let players = [];

  if (weekData.finished) {
    return getPlayers(teamIDs, week, true);
  }
  if (week > 1) {
    const lastWeekDataPromise = Promise.all(teamIDs.map(id => getEntryPicks(id, week - 1)));
    const playersPromise = getPlayers(teamIDs, week);

    let lastWeekData = [];
    [lastWeekData, players] = await Promise.all([lastWeekDataPromise, playersPromise]);
    totalPoints = lastWeekData.map(data => data.entry_history);
  } else {
    players = await getPlayers(teamIDs, week);
  }

  return players.map((player, i) => {
    player.prevTotal = totalPoints ? totalPoints[i].total_points : 0;
    return player;
  });
};
