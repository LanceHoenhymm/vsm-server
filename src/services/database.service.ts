import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { config } from 'dotenv';
config();

const connStr = `postgres://${process.env.POSTGRES_USERR}:${process.env.POSTGRES_PASSWORD}@localhost:5432/${process.env.POSTGRES_DB}`;
const connection = postgres(connStr);
export const db = drizzle(connection);
