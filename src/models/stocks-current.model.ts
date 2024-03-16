import { pgTable, integer, numeric, varchar } from 'drizzle-orm/pg-core';
import { stocks } from './stocks.model';

export const currentStocks = pgTable('current_stocks', {
  symbol: varchar('symbol')
    .notNull()
    .references(() => stocks.symbol),
  value: numeric('value', { precision: 10, scale: 2 }).notNull(),
  volatility: numeric('volatility', { precision: 10, scale: 2 }).notNull(),
  currentVolumeTraded: integer('current_volume_traded'),
});
