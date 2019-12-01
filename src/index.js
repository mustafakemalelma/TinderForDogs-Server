import { ApolloServer } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import typeDefs from "./graphql/typeDefs";
import resolvers from "./graphql/resolvers";
import { getUserFromToken } from "./utils";

//This is a funtion for starting the api.
//It will first try to connect the database
//If succeed then it will listen the port 5000
const startServer = async () => {
  //This is for reading .env file. All sensitive data is coming from that file.
  dotenv.config();

  const app = express();

  //This library is for handling graphql requests
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req, res }) => {
      await getUserFromToken(req, res);
      return { req, res };
    }
  });

  //this is for serving images folder so that when someone request the images via url they can get response.
  app.use(express.static("static"));

  //this is for allowing client to make request to this server.
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));

  //this is for the cookie set
  app.use(cookieParser());

  server.applyMiddleware({ app, cors: false });

  //Trying to connect Mongo Database
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
