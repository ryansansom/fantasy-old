import getPlayers from './get-players';

export default async(teamID = '', week = '', prevTotal = 0) => {
  const teamInfo = await getPlayers(teamID, week);

  return teamInfo.picks
    .filter(player => player.position <= 11) // Dumb version of players points - to be improved
    .reduce((total, player) => total + (player.points * player.multiplier), prevTotal - teamInfo.event_transfers_cost).toString();
}
