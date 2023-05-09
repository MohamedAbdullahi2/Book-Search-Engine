

// Importing the express library and the ApolloServer class from apollo-server-express
const express = require("express");
const { ApolloServer } = require("apollo-server-express");

// Importing the authentication middleware function from utils/auth
const { authMiddleware } = require("./utils/auth");
require("dotenv").config();

const path = require("path");
const db = require("./config/connection");
// const routes = require('./routes');

const { typeDefs, resolvers } = require("./schemas");

const app = express();
const PORT = process.env.PORT || 3001;

// new Apollo server & integrate with Express
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// Set up a route for the root URL of the app

app.get("/", (req, res) => {
    // Send the index.html file located in the client folder
  res.sendFile(path.join(__dirname, "../client/"));
});


const startApolloServer = async(typeDefs,resolvers)=>{
  await server.start()

    // Integrate the server with Express
  server.applyMiddleware({app})

  //Once the database connection is open, start listening for requests
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
}


// Call the startApolloServer function to start the app

startApolloServer(typeDefs,resolvers);