import { applyPoints } from './helpers/get-team-points';
import getPlayers from './get-players';

export default async (teamID = '', week = '', prevTotal = 0) => {
  const teamInfo = await getPlayers([teamID], week);

  return applyPoints(teamInfo[0], prevTotal, true, true).toString();
};
