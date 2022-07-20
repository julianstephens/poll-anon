import { PrismaClient } from "@prisma/client";
import { Request } from "express";
import { getUserId } from "../auth";

const prisma = new PrismaClient();

export interface Context {
  req: Request;
  prisma: PrismaClient;
  userId?: number;
}

export const context = ({ req }: { req: Request }): Context => {
  const token = req.headers.authorization || '';
  const userId = getUserId(token);

  return {
    req,
    prisma,
    userId: userId
  };
};
