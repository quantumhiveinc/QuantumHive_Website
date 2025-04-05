// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

// Declare a global variable to hold the Prisma Client instance
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Instantiate PrismaClient only once
// In development, Next.js clears the Node.js cache on every reload,
// so we store the instance on the global object to preserve it.
// In production, we just create a new instance.
const prisma = global.prisma || new PrismaClient({
  // Optional: Add logging configuration if needed
  // log: ['query', 'info', 'warn', 'error'],
});

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;