import getData from './get-json';

export default (playerID = '') => {
  const players = getData(`elements`);
  const player = players.find(player => player.id == playerID);
  return player ? player.event_points.toString() : '0';
}
