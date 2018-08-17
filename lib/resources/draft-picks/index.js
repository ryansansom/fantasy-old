export class DraftPicks {
  constructor(rootValue) {
    this.entryPicksLoader = rootValue.loaders.draftEntryPicksLoader;
  }

  getEntryPicks(id, week) {
    return this.entryPicksLoader.load(JSON.stringify({ id, week }));
  }
}
