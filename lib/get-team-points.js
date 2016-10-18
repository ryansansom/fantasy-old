import getPlayers from './get-players';

export default async(teamID = '', week = '', prevTotal = 0) => {
  const { event_transfers_cost, players } = await getPlayers(teamID, week);

  return players.picks
    .reduce((total, player) => total + (player.points * player.multiplier), prevTotal - event_transfers_cost).toString();
}
