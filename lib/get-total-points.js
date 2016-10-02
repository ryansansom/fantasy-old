import getData from './get-json';
import getTeamPoints from './get-team-points';

export default (userID = '', week = '') => {
  const { entry_history } = getData(`entry-${userID}-event-${week}-picks`);

  return getTeamPoints(userID, week, entry_history.total_points).toString();
}
