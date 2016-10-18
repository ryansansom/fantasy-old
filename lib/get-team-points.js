import getPlayers from './get-players';

export default async(teamID = '', week = '', prevTotal = 0) => {
  const teamInfo = await getPlayers(teamID, week);

  return applyPoints(teamInfo, prevTotal).toString();
}

function applyPoints(teamInfo, prevTotal, autoSubs = false, provisional_bonus = false) {
  return teamInfo.players.picks
    .reduce((total, player) => total + (player.points * player.multiplier), prevTotal - teamInfo.event_transfers_cost)
}
