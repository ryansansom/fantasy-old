import { getElements } from './fetch-data';

export default (picks = [{element: 0, multiplier: 1}]) => {
  const newPicks = picks.map(pick => {return {element: pick.element, multiplier: pick.multiplier, points: null}});
  return getElements()
    .then(players => newPicks.map(pick => {
      const player = players.find(player => player.id == pick.element);
      if (player) pick.points = player.event_points;
      return pick
    }))
    .catch(err => err);
}
