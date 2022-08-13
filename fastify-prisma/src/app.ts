import fastify, { FastifyReply, FastifyRequest } from "fastify";
import userRoutes from "./modules/user/user.route";
import productRoutes from "./modules/product/product.route";
import { userSchemas } from "./modules/user/user.schema";
import { productSchemas } from "./modules/product/product.schema";
import fjwt from "@fastify/jwt";
import swagger from "@fastify/swagger";
import { withRefResolver } from "fastify-zod";
import { version } from "../package.json";

export const server = fastify();

declare module "fastify" {
  export interface FastifyInstance {
    authenticate: any;
  }
}
declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      id: number;
      email: string;
      name: string;
    };
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
  for (const schema of [...userSchemas, ...productSchemas]) {
    server.addSchema(schema);
  }

  server.register(
    swagger,
    withRefResolver({
      routePrefix: "docs",
      exposeRoute: true,
      staticCSP: true,
      openapi: {
        info: {
          title: "fastify api",
          description: "API for some product",
          version,
        },
      },
    })
  );

  server.register(userRoutes, { prefix: "/api/users" });
  server.register(productRoutes, { prefix: "/api/products" });

  try {
    await server.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Server listining on port 3000");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
