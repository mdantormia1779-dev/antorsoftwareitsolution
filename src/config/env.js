import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const requiredEnvs = ['DATABASE_URL', 'PORT', 'JWT_SECRET'];

// Check for missing mandatory environment variables
for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`❌ Missing required environment variable: ${env}`);
  }
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
};