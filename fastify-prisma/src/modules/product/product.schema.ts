import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const productInput = {
  title: z.string(),
  price: z.number(),
  content: z.string().optional(),
};

const productGenrated = {
  id: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
};

const createProductSchema = z
  .object({
    title: z.string(),
    price: z.number(),
    content: z.string(),
  })
  .refine(
    (value) => {
      console.log({ value });
      return value.price > 100;
    },
    (value) => {
      return {
        message: `${value.price} is not valid price`,
      };
    }
  );

const productResponseSchema = z.object({
  ...productInput,
  ...productGenrated,
});
const productsResponseSchema = z.array(productResponseSchema);

export type CreateProductInput = z.infer<typeof createProductSchema>;
export const { schemas: productSchemas, $ref } = buildJsonSchemas(
  {
    createProductSchema,
    productResponseSchema,
    productsResponseSchema,
  },
  { $id: "productSchema" }
);
