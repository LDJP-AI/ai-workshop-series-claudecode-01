import { GraphQLRequest } from "@apollo/server";
import { graphql, GraphQLSchema } from "graphql";
import { schema } from "./schema";

export async function executeGraphQL(
  query: string,
  variables?: Record<string, any>,
) {
  const result = await graphql({
    schema,
    source: query,
    variableValues: variables,
  });

  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
    throw new Error(`GraphQL Error: ${result.errors[0].message}`);
  }

  return result.data;
}
