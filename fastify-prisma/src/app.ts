import fastify from "fastify";
import { exit } from "process";
import userRoutes from "./modules/user/user.route";

const server = fastify();

server.get("/healthcheck", async (request, response) => {
  return { status: "ok" };
});

const main = async () => {
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
