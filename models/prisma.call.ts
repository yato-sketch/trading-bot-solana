import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";
export const prisma = new PrismaClient();
export type Trader = User;
