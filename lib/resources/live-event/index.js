import { formatFixtures } from '../../helpers/get-players';

export class LiveEvent {
  constructor(rootValue) {
    this.eventLiveLoader = rootValue.loaders.eventLiveLoader;

    this._formattedFixturesMap = new Map();
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
    if (!this._formattedFixturesMap.has(week)) {
      this._formattedFixturesMap.set(week, this.getFixtures(week).then(formatFixtures));
    }

    return this._formattedFixturesMap.get(week);
  }
}
