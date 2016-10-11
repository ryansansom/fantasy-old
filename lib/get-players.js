import { getEntryPicks } from './fetch-data';

export default (userID = '', week = '') => {
  return getEntryPicks(userID, week)
    .then(res => res.picks)
    .then(picks => picks.map(pick => pick.element));
}
