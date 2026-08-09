import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis;

// ১. Neon Pooler URL হ্যান্ডেল করার জন্য connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Serverless / Dev environment-এ কানেকশন টাইমআউট এড়াতে
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// ২. Prisma Adapter তৈরি
const adapter = new PrismaPg(pool);

// ৩. Singleton Pattern হ্যান্ডলিং
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}