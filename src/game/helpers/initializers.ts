import { db } from '@services/database.service';
import { playerPortfolio, playerAccount, stocks } from '@models/index';
import { initialBankBalance } from '@common/game.config';

export async function initializeDatabase() {
  // eslint-disable-next-line drizzle/enforce-delete-with-where
  await db.delete(playerAccount);
}

export function initializePlayer(userId: string) {
  return db.transaction(async (trx) => {
    const stockColumn = (
      await trx.select({ symbol: stocks.symbol }).from(stocks)
    ).map((stock) => {
      return { symbol: stock.symbol, volume: 0 };
    });
    const [{ playerId }] = await trx
      .insert(playerAccount)
      .values({ userId, isBanned: false })
      .returning({ playerId: playerAccount.id });
    await trx.insert(playerPortfolio).values({
      playerId,
      bankBalance: initialBankBalance,
      stocks: stockColumn,
      totalPortfolioValue: 0,
    });

    return playerId;
  });
}
