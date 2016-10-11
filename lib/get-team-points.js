import getPlayerPoints from './get-player-points';
import { getEntryPicks } from './fetch-data';

export default (userID = '', week = '', prevTotal = 0) => {
  return getEntryPicks(userID, week)
    .then(res => res.picks)
    .then(picks => picks.filter(pick => pick.position <= 11))
    .then(picks => {
      return getPlayerPoints(picks)
        .then(players => players.reduce((total, player) => total + (player.points * player.multiplier), prevTotal))
        .then(res => res.toString());
    })
    .catch(err => err);
}
