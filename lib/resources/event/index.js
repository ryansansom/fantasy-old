export class Event {
  constructor(rootValue) {
    this.eventsLoader = rootValue.loaders.eventsLoader;
  }

  async weekData(week) {
    const events = await this.eventsLoader.load(0);

    if (week) {
      const currEvent = events[week - 1];

      return currEvent.id !== week
        ? events.find(event => event.id === week)
        : currEvent;
    }

    return events.find(event => event.is_current);
  }

  async getWeek(week) {
    return (await this.weekData(week)).id;
  }

  async gwEnded(week) {
    const weekData = await this.weekData(week);

    return weekData.finished && weekData.data_checked;
  }
}
