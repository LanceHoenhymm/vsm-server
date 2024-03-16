import { pgTable, uuid, numeric, jsonb } from 'drizzle-orm/pg-core';
import { playerAccount } from './player-account.model';

export const playerPortfolio = pgTable('player_portfolio', {
  playerId: uuid('player_id').references(() => playerAccount.id, {
    onDelete: 'cascade',
  }),
  bankBalance: numeric('bank_balance', { precision: 10, scale: 2 }).notNull(),
  totalPortfolioValue: numeric('total_portfolio_value', {
    precision: 10,
    scale: 2,
  }).notNull(),
  stocks: jsonb('stocks')
    .$type<{ symbol: string; volume: number }[]>()
    .notNull(),
});
