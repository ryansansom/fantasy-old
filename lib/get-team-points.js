import getData from './get-json';
import getPlayerPoints from './get-player-points';

export default (userID = '', week = '', prevTotal = 0) => {
  const { picks } = getData(`entry-${userID}-event-${week}-picks`);

  return picks
    .filter(pick => pick.position <= 11)
    .reduce((total, currentPlayer) => {
      return total + Number(getPlayerPoints(currentPlayer.element)) * currentPlayer.multiplier;
    }, prevTotal).toString();
}
