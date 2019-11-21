import { gql } from "apollo-server-express";

export default gql`
  scalar Date

  type Dog {
    id: ID!
    email: String!
    password: String!
    name: String!
    profilePic: Upload!
    pictures: [Upload!]
    selfSummary: String
    breed: String!
    age: Int!
    size: String!
    weight: Int!
    address: String!
    likes: [ID!]
    dislikes: [ID!]
    matches: [ID!]
    createdDate: Date!
  }

  type Match {
    id: ID!
    dog1: ID!
    dog2: ID!
    matchDate: Date!
  }

  type Message {
    id: ID!
    owner: ID!
    message: String!
    createdDate: Date!
  }

  type Query {
    dogs: [Dog!]!
  }

  type Mutation {
    registerDog(email: String!, password: String!): ID!
  }
`;
