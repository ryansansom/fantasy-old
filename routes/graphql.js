import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import ClassicLeague from '../lib/graphql/classic-league';

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type ClassicLeagueInfo {
    id: Int
    leagueName: String
    gameweekEnded: Boolean
    lastUpdated: Float
  }
  
  type Player {
    id: ID
    points: Int
    team: String
    position: String
    name: String
    expectedPoints: Float
    expectedPointsNext: Float
    provisionalBonus: Int
    actualBonus: Int
    gamesStarted: Boolean
    gamesFinished: Boolean
    pointsFinalised: Boolean
    minutesPlayed: Int
  }
  
  type Projections {
    autoSubsOut: [Int]
    autoSubsIn: [Int]
    playerPointsMultiplied: Int
  }
  
  type Entries {
    id: Int
    name: String
    teamName: String
    activeChip: String
    transferCost: Int
    previousTotal: Int
    picks: [Int]
    subs: [Int]
    captain: Int
    viceCaptain: Int
    playerPointsMultiplied: Int
    multiplier: Int
    currentPoints: Int
    projections: Projections
  }

  type ClassicLeague {
    leagueInfo: ClassicLeagueInfo
    entries: [Entries]
    players: [Player]
  }

  type Query {
    classicLeague(leagueId: Int!, week: Int, projectionMinute: Int): ClassicLeague
  }
`);

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
