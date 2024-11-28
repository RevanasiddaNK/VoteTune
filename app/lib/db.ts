import { PrismaClient } from "@prisma/client";

declare global {
  // This prevents TypeScript from complaining about the `global` variable
  var prisma: PrismaClient | undefined;
}

const prismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === "development") {
  global.prisma = prismaClient;
}

export { prismaClient };
