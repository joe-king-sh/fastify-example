import { FastifyReply, FastifyRequest } from "fastify";
import { CreateProductInput } from "./product.schema";
import { createProduct, getProducts } from "./product.service";

export const createProductHandler = async (
  request: FastifyRequest<{ Body: CreateProductInput }>,
  reply: FastifyReply
) => {
  const product = await createProduct({
    ...request.body,
    ownerId: request.user.id,
  });

  return reply.code(201).send(product);
};

export const getProductsHandler = async (
  _request: FastifyRequest,
  reply: FastifyReply
) => {
  const products = await getProducts();

  return reply.code(200).send(products);
};
