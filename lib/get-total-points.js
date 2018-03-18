import getTeamPoints from './get-team-points';
import { getEntryPicks } from './fetch-data';

export default async (teamID = '', weekNo = '') => {
  const week = Number(weekNo);
  let prevPoints = 0;

  if (week > 1) {
    const { entry_history: entryHistory } = await getEntryPicks(teamID, week - 1);
    prevPoints = entryHistory.total_points;
  }

  return getTeamPoints(teamID, week, prevPoints);
};
