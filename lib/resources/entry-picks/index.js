export class EntryPicks {
  constructor(rootValue) {
    this.entryPicksLoader = rootValue.loaders.entryPicksLoader;
  }

  getEntryPicks(id, week) {
    return this.entryPicksLoader.load(JSON.stringify({ id, week }));
  }
}
