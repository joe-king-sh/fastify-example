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
