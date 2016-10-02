import getData from './get-json';

export default () => {
  const events = getData('events');

  return events
    .filter(event => event.is_current)
    .map(event => event.id.toString())[0];
}
