import { getHistory } from './fetch-data';
import getPlayers from './get-players';

export default async (teamIDs = [], weekData = {}) => {
  const { id: week } = weekData;
  let totalPoints;
  let players = [];

  if (weekData.finished) {
    return getPlayers(teamIDs, week, true);
  }
  if (week > 1) {
    const totalPointsPromise = Promise.all(teamIDs.map(id => getHistory(id, week - 1)));
    const playersPromise = getPlayers(teamIDs, week);

    [players, totalPoints] = await Promise.all([playersPromise, totalPointsPromise]);
  } else {
    players = await getPlayers(teamIDs, week);
  }

  return players.map((player, i) => {
    player.prevTotal = totalPoints ? totalPoints[i] : 0;
    return player;
  });
};
