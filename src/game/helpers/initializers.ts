import { db } from '@services/database.service';
import { playerPortfolio, playerAccount, stocks } from '@models/index';
import { initialBankBalance } from '@common/game.config';
import { eq, ne } from 'drizzle-orm';

export async function initializePlayerTable() {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(playerAccount);
}

export function initializePlayer(userId: string) {
  return db.transaction(async (trx) => {
    let initialStockValue = 0;

    const stockData = (
      await trx
        .select({
          symbol: stocks.symbol,
          freebie: stocks.freebies,
          value: stocks.price,
        })
        .from(stocks)
        .where(eq(stocks.roundIntorduced, 1))
    ).map((stock) => {
      initialStockValue += stock.freebie * stock.value;
      return { symbol: stock.symbol, volume: stock.freebie };
    });

    (
      await trx
        .select({ symbol: stocks.symbol })
        .from(stocks)
        .where(ne(stocks.roundIntorduced, 1))
    ).forEach((stock) => {
      stockData.push({ symbol: stock.symbol, volume: 0 });
    });

    const [{ playerId }] = await trx
      .insert(playerAccount)
      .values({ userId, isBanned: false })
      .returning({ playerId: playerAccount.id });
    await trx.insert(playerPortfolio).values({
      playerId,
      bankBalance: initialBankBalance,
      stocks: stockData,
      totalPortfolioValue: initialStockValue,
    });

    return playerId;
  });
}
