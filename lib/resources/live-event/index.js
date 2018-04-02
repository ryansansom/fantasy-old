import { formatFixtures } from '../../helpers/get-players';

export class LiveEvent {
  constructor(rootValue) {
    this.eventLiveLoader = rootValue.loaders.eventLiveLoader;
  }

  getLiveEvent(week) {
    return this.eventLiveLoader.load(week);
  }

  async getFixtures(week) {
    return (await this.getLiveEvent(week)).fixtures;
  }

  async getElements(week) {
    return (await this.getLiveEvent(week)).elements;
  }

  async getFormattedFixtures(week) {
    return formatFixtures(await this.getFixtures(week));
  }
}
