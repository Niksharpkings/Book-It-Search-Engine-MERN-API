const timeElapsed = Date.now();
const today = new Date(timeElapsed);

const { ApolloServer } = require("apollo-server-express");
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const express = require("express");
const http = require("http");
const path = require("path");
const { typeDefs, resolvers } = require("./schema");
const { authMiddleware } = require("./utils/auth");
const db = require("./config/connection");
const app = express();
const PORT = process.env.PORT || 3001;

const startApolloServer = async (typeDefs, resolvers) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });
  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware,
    csrfPrevention: true,
    cache: "bounded",
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
  });
  await server.start();
  // integrate our Apollo server with the Express application as middleware
  server.applyMiddleware({ app });

  console.log(`
    Connection 🟢
    ⚡Running GraphQL at http://127.0.0.1:${PORT}${server.graphqlPath}
    ${today.toUTCString()}
    Performance:${performance.now()}
    `);

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`
    Connection 🟢
    ${today.toUTCString()}
    Budget-Tracker App ⚡On 127.0.0.1:${PORT}!✅
    Performance:${performance.now()}
    `);
      //log where we can go to test our GQL API
      console.log(`
    Connection 🟢
    ⚡Running GraphQL at http://127.0.0.1:${PORT}${server.graphqlPath}
    ${today.toUTCString()}
    Performance:${performance.now()}
    `);
    });
  });
};

startApolloServer(typeDefs, resolvers);
