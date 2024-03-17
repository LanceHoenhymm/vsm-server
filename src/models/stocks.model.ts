import {
  pgTable,
  smallint,
  integer,
  doublePrecision,
  varchar,
} from 'drizzle-orm/pg-core';

export const stocks = pgTable('stocks', {
  symbol: varchar('symbol').notNull().primaryKey(),
  roundIntorduced: smallint('round_introduced').notNull(),
  price: doublePrecision('price').notNull(),
  volatility: doublePrecision('volatility').notNull(),
  currentVolumeTraded: integer('current_volume_traded'),
  maxVolume: integer('max_volume'),
});
