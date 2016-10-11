import getPlayerPoints from './get-player-points';
import { getEntryPicks } from './fetch-data';

export default (userID = '', week = '', prevTotal = 0) => {
  return getEntryPicks(userID, week)
    .then(res => res.picks)
    .then(picks => picks.filter(pick => pick.position <= 11))
    .then(picks => Promise.all(picks.map(pick => getPlayerPoints(pick.element, pick.multiplier))))
    .then(playerPoints => playerPoints.reduce((total, points) => total + Number(points), prevTotal))
    .then(playerPoints => playerPoints.toString())
    .catch(err => err);
}
