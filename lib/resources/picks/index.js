export class Picks {
  constructor(rootValue) {
    this.picksLoader = rootValue.loaders.draftEntryPicksLoader;
  }

  getEntryPicks(id, week) {
    return this.picksLoader.load(JSON.stringify({ id, week }));
  }
}
