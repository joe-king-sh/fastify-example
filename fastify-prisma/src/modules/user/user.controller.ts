import { Prisma } from "@prisma/client";
import { FastifyReply, FastifyRequest } from "fastify";
import { Server } from "http";
import { REPL_MODE_SLOPPY } from "repl";
import { server } from "../../app";
import { verifyPassword } from "../../utils/hash";
import { CreateUserInput, LoginInput } from "./user.schema";
import { createUser, findUserByEmail, findUsers } from "./user.service";

export const registerUserHandler = async (
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) => {
  const body = request.body;

  try {
    const user = await createUser(body);
    return reply.code(201).send(user);
  } catch (error) {
    console.log(error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return reply.code(400).send({
          message: "Email is already taken",
        });
      }
    }
    return reply.code(500).send(error);
  }
};

export const loginHandler = async (
  request: FastifyRequest<{ Body: LoginInput }>,
  reply: FastifyReply
) => {
  const body = request.body;

  // find a user by email
  const user = await findUserByEmail(body.email);

  if (!user) {
    return reply.code(401).send({
      message: "Invalid email or password",
    });
  }

  // verify password
  const correctPassword = verifyPassword({
    candidatePassword: body.password,
    salt: user.salt,
    hash: user.password,
  });
  if (correctPassword) {
    const { password, salt, ...rest } = user;
    return { accessToken: server.jwt.sign(rest) };
  }

  return reply.code(401).send({
    message: "Invalid email or password",
  });
};

export const getUsersHandler = async () => {
  return findUsers();
};
