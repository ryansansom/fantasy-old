import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import ClassicStyleLeague, { classicStyleLeagueType } from './classic-style-league';

const query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    classicStyleLeague: {
      type: classicStyleLeagueType,
      args: {
        leagueId: { type: GraphQLInt },
        week: { type: GraphQLInt },
        projectionMinute: { type: GraphQLInt },
        draft: { type: GraphQLBoolean },
      },
      resolve(_, args, { resources }) {
        return new ClassicStyleLeague({ args, resources });
      },
    },
  },
});

const schema = new GraphQLSchema({
  query,
});

export default schema;
