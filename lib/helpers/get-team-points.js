function applyProvBonus(applyBonus, player) {
  const bonus = (applyBonus && !player.game_points_finalised) ? player.provisional_bonus : 0;

  return (player.points + bonus) * player.multiplier;
}

export function applyPoints(teamInfo, prevTotal = 0, autoSubs = false, provisionalBonus = false) {
  let finalPlayers = teamInfo.players.picks;
  if (autoSubs) {
    finalPlayers = teamInfo.players.picks.concat(teamInfo.players.subs)
      .filter(player => player.autoSub_out === false || player.autoSub_in === true);
  }

  return finalPlayers
    .reduce((total, player) => total + applyProvBonus(provisionalBonus, player), prevTotal - teamInfo.event_transfers_cost);
}
