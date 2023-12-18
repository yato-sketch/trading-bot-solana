import { PrismaClient } from "@prisma/client";
import { User, Trades, Orders } from "@prisma/client";
export const prisma = new PrismaClient();
export type Trader = User;
export { Trades, Orders };
