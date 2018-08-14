import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
} from 'graphql';
import ClassicLeague, { classicLeagueType } from './classic-league';
import DraftLeague, { draftLeagueType } from './draft-league';

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
    draftLeague: {
      type: draftLeagueType,
      args: {
        leagueId: { type: GraphQLInt },
        week: { type: GraphQLInt },
        projectionMinute: { type: GraphQLInt },
      },
      resolve(_, args, { resources }) {
        // TODO: work out how to combine both leagues
        return new DraftLeague({ args, resources, draft: true });
      },
    },
  },
});

const schema = new GraphQLSchema({
  query,
});

export default schema;
