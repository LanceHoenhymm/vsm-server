import {
  pgTable,
  integer,
  doublePrecision,
  varchar,
} from 'drizzle-orm/pg-core';
import { stocks } from './stocks.model';

export const currentStocks = pgTable('current_stocks', {
  symbol: varchar('symbol')
    .notNull()
    .references(() => stocks.symbol),
  value: doublePrecision('value').notNull(),
  volatility: doublePrecision('volatility').notNull(),
  currentVolumeTraded: integer('current_volume_traded').notNull(),
});
