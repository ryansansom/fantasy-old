import {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLFloat,
  GraphQLBoolean,
} from 'graphql';
import RootValue from './base';

export const draftLeagueInfoType = new GraphQLObjectType({
  name: 'draftLeagueInfo',
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
    gameweekEnded: { type: GraphQLBoolean },
    lastUpdated: { type: GraphQLFloat },
  },
});

export default class DraftLeagueInfo extends RootValue {
  id() {
    return this.resources.draftLeagueStandings.leagueId(this.args.leagueId);
  }

  name() {
    return this.resources.draftLeagueStandings.leagueName(this.args.leagueId);
  }

  gameweekEnded() {
    return this.resources.events.gwEnded(this.args.week);
  }

  lastUpdated = () => Date.now(); // TODO: Change this to resolve at the end of all requests
}
