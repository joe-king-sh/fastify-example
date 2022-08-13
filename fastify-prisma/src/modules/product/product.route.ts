import { FastifyInstance } from "fastify";
import { createProductHandler, getProductsHandler } from "./product.controller";
import { $ref } from "./product.schema";

const productRoutes = async (server: FastifyInstance) => {
  server.post(
    "/",
    {
      schema: {
        body: $ref("createProductSchema"),
        response: { 201: $ref("productResponseSchema") },
      },
      preHandler: [server.authenticate],
    },
    createProductHandler
  );

  server.get(
    "/",
    {
      schema: {
        response: { 200: $ref("productsResponseSchema") },
      },
      preHandler: [server.authenticate],
    },
    getProductsHandler
  );
};

export default productRoutes;
