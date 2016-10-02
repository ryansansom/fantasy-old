import getData from './get-json';

export default (playerID = '', week = '') => {
  const { picks } = getData(`entry-${playerID}-event-${week}-picks`);

  return picks.map(pick => pick.element);
}
