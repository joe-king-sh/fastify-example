import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";

export const createUser = async (input: CreateUserInput) => {
  const { password, ...rest } = input;
  const { hash, salt } = await hashPassword(password);

  const user = await prisma.user.create({
    data: { salt, password: hash, ...rest },
  });

  return user;
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUsers = async () =>
  prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
