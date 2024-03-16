import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
config();

const connStr = `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:5432/${process.env.DB}`;
const connection = postgres(connStr);
export const db = drizzle(connection);
