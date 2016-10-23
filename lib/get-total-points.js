import getTeamPoints from './get-team-points';
import { getEntryPicks } from './fetch-data';

export default async(teamID = '', week = '') => {
  week = Number(week);
  let prevPoints = 0;

  if (week > 1) {
    const { entry_history } = await getEntryPicks(teamID, week - 1);
    prevPoints = entry_history.total_points;
  }

  return (await getTeamPoints(teamID, week, prevPoints));
}
