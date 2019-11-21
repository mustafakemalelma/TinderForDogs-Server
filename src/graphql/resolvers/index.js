import { GraphQLScalarType } from "graphql";
import { Kind } from "graphql/language";

import { DogQueries, DogMutations } from "./Dog";

export default {
  Query: {
    ...DogQueries
  },

  Mutation: {
    ...DogMutations
  },

  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value);
    },
    serialize(value) {
      return value.getTime();
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return new Date(ast.value);
      }
      return null;
    }
  })
};
