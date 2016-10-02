import getData from './get-json';

export default (userID = '', week = '') => {
  const { picks } = getData(`entry-${userID}-event-${week}-picks`);

  return picks.map(pick => pick.element);
}
