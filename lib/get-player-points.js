import { getElements } from './fetch-data';

export default (playerID = '', multiplier = 1) => {
  return getElements()
    .then(players => players.find(player => player.id == playerID))
    .then(player => player ? (multiplier * player.event_points).toString() : '0')
    .catch(err => err);
}
