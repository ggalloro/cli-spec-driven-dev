import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import Database from 'better-sqlite3'
import path from 'path';

const prismaClientSingleton = () => {
  // Extract filename from DATABASE_URL or default to dev.db
  // DATABASE_URL is typically "file:./dev.db"
  const dbPath = process.env.DATABASE_URL?.replace("file:", "") || "dev.db";
  
  // Resolve path relative to project root if it starts with ./
  const resolvedPath = dbPath.startsWith("./") ? path.join(process.cwd(), dbPath) : dbPath;

  const connection = new Database(resolvedPath);
  const adapter = new PrismaBetterSqlite3(connection as any);
  return new PrismaClient({ adapter });
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma