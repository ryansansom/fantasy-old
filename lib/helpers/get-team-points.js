function getMultiplier(player, switchCaptain) {
  if (switchCaptain) {
    if (player.element === switchCaptain.from) {
      return 1;
    }

    if (player.element === switchCaptain.to) {
      return switchCaptain.multiplier;
    }
  }

  return player.multiplier;
}

function applyProvBonus(applyBonus, player, property = 'points', switchCaptain) {
  const multiplier = getMultiplier(player, switchCaptain);

  const bonus = (applyBonus && !player.game_points_finalised) ? player.provisional_bonus : 0;

  return (player[property] + bonus) * multiplier;
}

export function applyPoints(teamInfo, prevTotal = 0, autoSubs = false, provisionalBonus = false, property, switchCaptain) {
  let finalPlayers = teamInfo.players.picks;
  if (autoSubs) {
    finalPlayers = teamInfo.players.picks.concat(teamInfo.players.subs)
      .filter(player => player.autoSub_out === false || player.autoSub_in === true);
  }

  return finalPlayers
    .reduce((total, player) => total + applyProvBonus(provisionalBonus, player, property, switchCaptain), prevTotal - teamInfo.event_transfers_cost);
}
