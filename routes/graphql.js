import graphqlHTTP from 'express-graphql';
import schema from '../lib/graphql/schema';

const graphiql = process.env.NODE_ENV !== 'production';

export default graphqlHTTP({
  schema,
  graphiql,
});
