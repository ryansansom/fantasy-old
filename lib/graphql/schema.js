import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
} from 'graphql';
import ClassicLeague, { classicLeagueType } from './classic-league';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    classicLeague: {
      type: classicLeagueType,
      args: {
        leagueId: { type: GraphQLInt },
        week: { type: GraphQLInt },
        projectionMinute: { type: GraphQLInt },
      },
      resolve(_, args, { resources }) {
        return new ClassicLeague({ args, resources });
      },
    },
  },
});

const schema = new GraphQLSchema({
  query,
});

export default schema;
