import { executeGraphqlQuery } from './internal-api';

const graphqlExecutor = process.env.CLIENT_RENDER
  ? () => executeGraphqlQuery
  : context => query => require('graphql').graphql(require('./graphql/schema').default, query, undefined, context); // eslint-disable-line global-require

export default graphqlExecutor;
