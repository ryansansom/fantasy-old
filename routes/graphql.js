import graphqlHTTP from 'express-graphql';
import schema from '../lib/graphql/types';

const graphiql = process.env.NODE_ENV !== 'production';

export default graphqlHTTP({
  schema,
  graphiql,
});
