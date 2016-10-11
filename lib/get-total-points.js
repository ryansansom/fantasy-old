import getTeamPoints from './get-team-points';
import { getEntryPicks } from './fetch-data';

export default (userID = '', week = '') => {
  return getEntryPicks(userID, week)
    .then(res => res.entry_history.total_points)
    .then(totalPoints => getTeamPoints(userID, week, totalPoints))
    .catch(err => err);
}
