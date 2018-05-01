import { executeGraphqlQuery } from './internal-api';

const graphqlExecutor = process.env.CLIENT_RENDER
  ? () => executeGraphqlQuery
  : context => (query, variables) => require('graphql').graphql(require('./graphql/schema').default, query, undefined, context, variables); // eslint-disable-line global-require

export default graphqlExecutor;
