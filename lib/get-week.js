import { getEvents } from './fetch-data';

export default async() => {
  const events = await getEvents();
  return events
    .filter(event => event.is_current)[0];
}
