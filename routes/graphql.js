import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type ClassicLeagueInfo {
    leagueId: Int
    leagueName: String
    gwEnded: Boolean
    lastUpdated: Float
    players: [Int]
  }

  type ClassicLeague {
    leagueInfo: ClassicLeagueInfo
    players: [Int]
  }

  type Query {
    classicLeague(leagueId: Int!, week: Int): ClassicLeague
  }
`);

class RootClass {
  constructor(rootValue) {
    this.args = rootValue.args;
    this.resources = rootValue.resources;
  }
}

class ClassicLeagueInfo extends RootClass {
  leagueId() {
    return this.resources.classicLeagueStandings.leagueId(this.args.leagueId);
  }

  leagueName() {
    return this.resources.classicLeagueStandings.leagueName(this.args.leagueId);
  }

  gwEnded() {
    return this.resources.events.gwEnded(this.args.week);
  }

  lastUpdated = () => Date.now(); // TODO: Change this to resolve at the end of all requests

  players() {
    return this.resources.classicLeagueStandings.players(this.args.leagueId);
  }
}

class ClassicLeague extends RootClass {
  get classicLeagueInfo() {
    if (!this._classicLeagueInfo) {
      this._classicLeagueInfo = new ClassicLeagueInfo(this);
    }

    return this._classicLeagueInfo;
  }

  async leagueInfo() {
    return this.classicLeagueInfo;
  }

  players() {
    return this.classicLeagueInfo.players();
  }
}

// The root provides the top-level API endpoints
const rootValue = {
  classicLeague(args, { resources }) {
    return new ClassicLeague({ args, resources });
  },
};

export default graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
});
