import { IGameState } from '@/types';
import { playerPortfolio, stocks } from '@models/index';
import { db } from '@services/index';
import { eq, lte } from 'drizzle-orm';
import { arrayToMap } from '@common/utils';

function calculateNewStockPrice(price: number, volatility: number) {
  const valChange = (volatility + 100) / 100;
  const cointoss = Math.random() > 0.5 ? 1 : -1;
  const volChange = (volatility * cointoss + 100) / 100;
  return { newPrice: price * valChange, newVolatility: volatility * volChange };
}

export function updateStocks(gameState: IGameState) {
  return db.transaction(async (trx) => {
    const stocksData = await trx
      .select()
      .from(stocks)
      .where(lte(stocks.roundIntorduced, gameState.roundNo));

    const updateAllStocks = stocksData.map((stockData) => {
      const { newPrice: newPrice, newVolatility } = calculateNewStockPrice(
        stockData.price,
        stockData.volatility,
      );
      return trx
        .update(stocks)
        .set({ price: newPrice, volatility: newVolatility })
        .where(eq(stocks.symbol, stockData.symbol));
    });
    await Promise.all(updateAllStocks);
  });
}

export function updatePlayerPortfolio() {
  return db.transaction(async (trx) => {
    const players = await trx.select().from(playerPortfolio);
    const stocksData = arrayToMap(await trx.select().from(stocks), 'symbol');

    const updateAllPlayerPortfolio = players.map((player) => {
      const playerPort = player.stocks;

      const totalPortfolioValue = playerPort.reduce((acc: number, stock) => {
        const stockVolumeOwned = stock.volume || 0;
        const stockValue = stocksData.get(stock.symbol)?.price || 0;
        return acc + stockVolumeOwned * stockValue;
      }, 0);

      return trx
        .update(playerPortfolio)
        .set({ totalPortfolioValue })
        .where(eq(playerPortfolio.playerId, player.playerId));
    });
    await Promise.all(updateAllPlayerPortfolio);
  });
}
