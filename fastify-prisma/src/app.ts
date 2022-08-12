import fastify from "fastify";
import { exit } from "process";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";

const server = fastify();

server.get("/healthcheck", async (request, response) => {
  return { status: "ok" };
});

const main = async () => {
  //先にスキーマを追加してからRouteを登録する
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }
  server.register(userRoutes, { prefix: "/api/users" });

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server listining on port 3000");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
