import { getEvents } from './fetch-data';

export default async (week) => {
  let weekData;
  if (week && !isNaN(week)) {
    const events = await getEvents();
    const currEvent = events[Number(week) - 1];
    weekData = currEvent.id !== Number(week) ? events.find(event => event.id === Number(week)) : currEvent;
  } else {
    weekData = (await getEvents())
      .find(event => event.is_current);
  }

  return weekData;
};
