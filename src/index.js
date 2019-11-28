import { ApolloServer } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { getUserFromToken } from "./utils";

const startServer = async () => {
  dotenv.config();
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
      await getUserFromToken(req, res);
      return { req, res };
    }
  });

  app.use(express.static("static"));
  app.use(cookieParser());
  server.applyMiddleware({ app });

  try {
    await mongoose.connect(process.env.DB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  } catch (error) {
    console.error("could not connect to the database!", error);
  }

  app.listen({ port: 5000 }, () => console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`));
};

startServer();
