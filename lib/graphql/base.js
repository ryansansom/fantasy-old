export default class RootValue {
  constructor(rootValue) {
    this.args = rootValue.args;
    this.resources = rootValue.resources;

    this.getPicksLoader = rootValue.draft
      ? rootValue.resources.draftPicks
      : rootValue.resources.entryPicks;

    this.allPlayers = rootValue.allPlayers;
    this.allEntries = rootValue.allEntries;
  }
}
