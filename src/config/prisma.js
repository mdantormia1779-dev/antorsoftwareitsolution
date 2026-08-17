import 'dotenv/config'; // ডটএভ ফাইল স্বয়ংক্রিয়ভাবে লোড করার জন্য
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';

const { Pool } = pkg;
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined in environment variables.');
}

// ক্লাউড ডেটাবেজের জন্য কানেকশন পুল ও এসএসএল সেটআপ
export const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

prisma.$connect()
  .then(() => console.log('✅ Prisma connected successfully via Driver Adapter'))
  .catch((e) => console.error('❌ Prisma connection error:', e));

export default prisma;