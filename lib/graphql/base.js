export default class RootValue {
  constructor(rootValue) {
    this.args = rootValue.args;
    this.resources = rootValue.resources;

    this.picksResource = rootValue.picksResource;
    this.classicStyleStandingsResource = rootValue.classicStyleStandingsResource;

    this.allPlayers = rootValue.allPlayers;
    this.allEntries = rootValue.allEntries;
  }
}
