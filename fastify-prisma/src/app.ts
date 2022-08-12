import fastify, { FastifyReply, FastifyRequest } from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import fjwt from "@fastify/jwt";

export const server = fastify();

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}

server.get("/healthcheck", async (request, response) => {
  return { status: "ok" };
});

server.register(fjwt, {
  secret: "supersecret",
});
server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (e) {
      return reply.send(e);
    }
  }
);

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
