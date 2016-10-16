import getPlayers from './get-players';
import { acceptableFormations, autoSubs } from './helpers/get-team-points';

export default async(teamID = '', week = '', prevTotal = 0) => {
  const { active_chip, event_transfers_cost, picks } = await getPlayers(teamID, week);

  return autoSubs(picks, active_chip, acceptableFormations)
    .reduce((total, player) => total + (player.points * player.multiplier), prevTotal - event_transfers_cost).toString();
}
