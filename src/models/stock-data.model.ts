import {
  pgTable,
  smallint,
  doublePrecision,
  varchar,
} from 'drizzle-orm/pg-core';

export const stockGameData = pgTable('stocks', {
  symbol: varchar('symbol').notNull(),
  forRound: smallint('round_applicable').notNull().primaryKey(),
  volatility: doublePrecision('volatility').notNull(),
});
