import { db } from '../../services/database.service';
import { news, stocks, playerAccount, users } from '../../models/index';

export async function uploadNews(
  newsData: {
    content: string;
    forInsider: boolean;
    roundApplicable: number;
  }[],
) {
  await db.insert(news).values(newsData);
}

export async function uploadStock(
  stockData: {
    symbol: string;
    volatility: number;
    freebies: number;
    price: number;
    roundIntorduced: number;
  }[],
) {
  await db.insert(stocks).values(stockData);
}

export async function flushDatabase() {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(news);
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(stocks);
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(playerAccount);
}

export async function flushPlayerTable() {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(playerAccount);
}

export async function flushUserTable() {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(users);
}
