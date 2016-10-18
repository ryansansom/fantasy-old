import getPlayers from './get-players';

export default async(teamID = '', week = '', prevTotal = 0) => {
  const teamInfo = await getPlayers(teamID, week);

  return applyPoints(teamInfo, prevTotal).toString();
}

function applyPoints(teamInfo, prevTotal, autoSubs = false, provisional_bonus = false) {
  let finalPlayers = teamInfo.players.picks;
  if (autoSubs) {
    finalPlayers = teamInfo.players.picks.concat(teamInfo.players.subs)
      .filter(player => player.autoSub_out === false || player.autoSub_in === true)
  }

  return finalPlayers
    .reduce((total, player) => total + applyProvBonus(provisional_bonus, player), prevTotal - teamInfo.event_transfers_cost)
}

function applyProvBonus(applyBonus, player) {
  let bonus = 0;
  if (applyBonus && !player.game_points_finalised) {
    bonus = player.bonus;
  }

  return (player.points + bonus) * player.multiplier;
}
