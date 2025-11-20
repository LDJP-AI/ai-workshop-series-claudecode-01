import { GraphQLRequest } from '@apollo/server';
import { schema } from './schema';
import { graphql, GraphQLSchema } from 'graphql';

export async function executeGraphQL(query: string, variables?: Record<string, any>) {
  const result = await graphql({
    schema,
    source: query,
    variableValues: variables,
  });

  if (result.errors) {
    console.error('GraphQL errors:', result.errors);
    throw new Error(`GraphQL Error: ${result.errors[0].message}`);
  }

  return result.data;
}
