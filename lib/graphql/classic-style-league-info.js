import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
} from 'graphql';
import RootValue from './base';

export const classicStyleLeagueInfoType = new GraphQLObjectType({
  name: 'classicStyleLeagueInfo',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    gameweekEnded: { type: GraphQLBoolean },
    lastUpdated: { type: GraphQLFloat },
  },
});

export default class ClassicStyleLeagueInfo extends RootValue {
  id() {
    return this.classicStyleStandingsResource.leagueId(this.args.leagueId);
  }

  name() {
    return this.classicStyleStandingsResource.leagueName(this.args.leagueId);
  }

  gameweekEnded() {
    return this.resources.events.gwEnded(this.args.week);
  }

  lastUpdated = () => Date.now(); // TODO: Change this to resolve at the end of all requests
}
