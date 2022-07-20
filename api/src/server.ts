import { ApolloServer } from "apollo-server-express";
import * as GraphiQL from "apollo-server-module-graphiql";
import express from "express";
import { createServer, Server } from "http";
import * as url from "url";
import { context } from "./context";
import schema from "./schema";
import {

  ApolloServerPluginLandingPageGraphQLPlayground

} from "apollo-server-core";
import { WebSocketServer } from "ws";

type ExpressGraphQLOptionsFunction = (
  req?: express.Request,
  res?: express.Response
) => any | Promise<any>;

function graphiqlExpress(
  options: GraphiQL.GraphiQLData | ExpressGraphQLOptionsFunction
) {
  const graphiqlHandler = (
    req: express.Request,
    res: express.Response,
    next: any
  ) => {
    const query = req.url && url.parse(req.url, true).query;
    GraphiQL.resolveGraphiQLString(query, options, req).then(
      (graphiqlString: any) => {
        res.setHeader("Content-Type", "text/html");
        res.write(graphiqlString);
        res.end();
      },
      (error: any) => next(error)
    );
  };

  return graphiqlHandler;
}

export default async (port: number): Promise<Server> => {
  const app = express();

  const server: Server = createServer(app);

  const apolloServer = new ApolloServer({
    schema,
    context: context,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
    csrfPrevention: true,
    cache: "bounded",
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: "/graphql", cors: { origin: "http://localhost:3000", credentials: true } });

  if (module.hot) {
    app.use(
      "/graphiql",
      graphiqlExpress({
        endpointURL: "/graphql",
        query:
          "# Welcome to your own GraphQL server!\n#\n" +
          "# Press Play button above to execute GraphQL query\n#\n" +
          "# You can start editing source code and see results immediately\n\n" +
          "query hello($subject:String) {\n  hello(subject: $subject)\n}",
        subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`,
        variables: { subject: "World" }
      })
    );
  }

  return new Promise<Server>(resolve => {
    server.listen(port, () => {
      // tslint:disable-next-line
      new WebSocketServer({
        server: server,
        path: "/subscriptions"
      })
      resolve(server);
    });
  });
};
