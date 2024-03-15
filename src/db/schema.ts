import {
  pgTable,
  uuid,
  boolean,
  serial,
  smallint,
  integer,
  numeric,
  char,
  varchar,
  text,
  jsonb,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: varchar('email').notNull().unique(),
  password: char('password', { length: 32 }).notNull(),
  p1Name: varchar('u1Name').notNull(),
  p2Name: varchar('u2Name'),
  isAdmin: boolean('is_admin').notNull().default(false),
});

export const playerAccount = pgTable('player_account', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  isBanned: boolean('is_banned').notNull().default(false),
});

export const playerPortfolio = pgTable('player_portfolio', {
  playerId: uuid('player_id').references(() => playerAccount.id),
  bankBalance: numeric('bank_balance', { precision: 10, scale: 2 }).notNull(),
  totalPortfolioValue: numeric('total_portfolio_value', {
    precision: 10,
    scale: 2,
  }).notNull(),
  stocks: jsonb('stocks')
    .$type<{ symbol: string; volume: number }[]>()
    .notNull(),
});

export const playerPowerups = pgTable('player_powerups', {});

export const news = pgTable('news', {
  id: serial('id').primaryKey(),
  roundApplicable: smallint('round_applicable').notNull(),
  content: text('content').notNull(),
  forInsider: boolean('for_insider').notNull().default(false),
});

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

export const currentStocks = pgTable('current_stocks', {
  symbol: varchar('symbol')
    .notNull()
    .references(() => stocks.symbol),
  value: numeric('value', { precision: 10, scale: 2 }).notNull(),
  volatility: numeric('volatility', { precision: 10, scale: 2 }).notNull(),
  currentVolumeTraded: integer('current_volume_traded'),
});
