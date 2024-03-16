import {
  pgTable,
  smallint,
  integer,
  numeric,
  varchar,
} from 'drizzle-orm/pg-core';

export const stocks = pgTable('stocks', {
  symbol: varchar('symbol').notNull().primaryKey(),
  name: varchar('name').notNull(),
  roundIntorduced: smallint('round_introduced').notNull(),
  initialPrice: numeric('initial_price', { precision: 10, scale: 2 }).notNull(),
  initialVolatility: numeric('initial_volatility', {
    precision: 10,
    scale: 2,
  }).notNull(),
  maxVolume: integer('max_volume').notNull(),
});
