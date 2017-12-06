import { getEvents } from './fetch-data';

export default async (weekNo) => {
  let weekData;
  const week = Number(weekNo);
  if (week && !Number.isNaN(week)) {
    const events = await getEvents();
    const currEvent = events[week - 1];
    weekData = currEvent.id !== week ? events.find(event => event.id === week) : currEvent;
  } else {
    weekData = (await getEvents())
      .find(event => event.is_current);
  }

  return weekData;
};
