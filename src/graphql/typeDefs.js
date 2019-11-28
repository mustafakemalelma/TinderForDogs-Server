import { gql } from "apollo-server-express";

export default gql`
  scalar Date

  type Dog {
    id: ID!
    email: String!
    password: String!
    name: String!
    profilePic: String!
    pictures: [String!]
    selfSummary: String
    breed: String!
    age: String!
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

  type LikeResponse {
    successful: Boolean!
    isAMatch: Boolean
  }

  type Message {
    id: ID!
    owner: ID!
    message: String!
    createdDate: Date!
  }

  type Query {
    dogs: [Dog!]!

    loginDog(email: String!, password: String!): Dog!
  }

  type Mutation {
    registerDog(
      email: String!
      password: String!
      name: String!
      profilePic: Upload!
      selfSummary: String
      breed: String!
      age: String!
      size: String!
      weight: Int!
      address: String!
    ): ID!

    invalidateTokens: Boolean!

    like(likedId: ID!): LikeResponse!
    dislike(dislikedId: ID!): Boolean!
  }
`;
