import { getEvents } from './fetch-data';

export default () => {
  return getEvents()
    .then(events => {
      return events
        .filter(event => event.is_current)
        .map(event => event.id.toString())[0];
    })
    .catch(err => err);
}
