import { makeExecutableSchema } from "@graphql-tools/schema";
import resolvers from "./graphql/resolvers";
import typeDefs from "./graphql/schema";

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default executableSchema;
