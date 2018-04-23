import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
} from 'graphql';
import RootValue from './base';

export const classicLeagueInfoType = new GraphQLObjectType({
  name: 'leagueInfo',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    gameweekEnded: { type: GraphQLBoolean },
    lastUpdated: { type: GraphQLFloat },
  },
});

export default class ClassicLeagueInfo extends RootValue {
  id() {
    return this.resources.classicLeagueStandings.leagueId(this.args.leagueId);
  }

  name() {
    return this.resources.classicLeagueStandings.leagueName(this.args.leagueId);
  }

  gameweekEnded() {
    return this.resources.events.gwEnded(this.args.week);
  }

  lastUpdated = () => Date.now(); // TODO: Change this to resolve at the end of all requests
}
