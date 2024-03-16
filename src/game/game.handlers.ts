import { NotFound, UnprocessableEntity } from '@errors/index';
import { currentStocks, playerPortfolio } from '@models/index';
import { db } from '@services/index';
import { eq } from 'drizzle-orm';
import { deseaialize } from '@common/utils';

export function buyStock(teamId: string, stockId: string, quantity: number) {
  return db.transaction(async (trx) => {
    const [stockData] = await trx
      .select()
      .from(currentStocks)
      .where(eq(currentStocks.symbol, stockId));
    const [playerPort] = await trx
      .select()
      .from(playerPortfolio)
      .where(eq(playerPortfolio.playerId, teamId));

    if (!stockData) {
      throw new NotFound('Stock not found');
    }
    if (!playerPort) {
      throw new NotFound('Player not found');
    }

    const balance = playerPort.bankBalance;
    const stockPrice = stockData.value;
    const totalCost = stockPrice * quantity;
    if (balance < totalCost) {
      throw new UnprocessableEntity('Insufficient funds');
    }

    const stocks = deseaialize(playerPort.stocks);
    const stockIndex = stocks.findIndex((stock) => stock.symbol === stockId);
    if (stockIndex === -1) {
      stocks.push({ symbol: stockId, volume: quantity });
    } else {
      stocks[stockIndex].volume += quantity;
    }

    await trx
      .update(playerPortfolio)
      .set({
        bankBalance: balance - totalCost,
        totalPortfolioValue: playerPort.totalPortfolioValue + totalCost,
        stocks,
      })
      .where(eq(playerPortfolio.playerId, teamId));
    await trx
      .update(currentStocks)
      .set({ currentVolumeTraded: stockData.currentVolumeTraded + quantity })
      .where(eq(currentStocks.symbol, stockId));
  });
}

export function sellStock(teamId: string, stockId: string, quantity: number) {
  return db.transaction(async (trx) => {
    const [stockData] = await trx
      .select()
      .from(currentStocks)
      .where(eq(currentStocks.symbol, stockId));
    const [playerPort] = await trx
      .select()
      .from(playerPortfolio)
      .where(eq(playerPortfolio.playerId, teamId));

    if (!stockData) {
      throw new NotFound('Stock not found');
    }
    if (!playerPort) {
      throw new NotFound('Player not found');
    }

    const stocks = deseaialize(playerPort.stocks);
    const stockIndex = stocks.findIndex((stock) => stock.symbol === stockId);
    if (stockIndex === -1) {
      throw new UnprocessableEntity('Stock not found in portfolio');
    }
    if (stocks[stockIndex].volume < quantity) {
      throw new UnprocessableEntity('Insufficient stocks');
    }

    const stockPrice = stockData.value;
    const totalCost = stockPrice * quantity;
    stocks[stockIndex].volume -= quantity;

    await trx
      .update(playerPortfolio)
      .set({
        bankBalance: playerPort.bankBalance + totalCost,
        totalPortfolioValue: playerPort.totalPortfolioValue - totalCost,
        stocks,
      })
      .where(eq(playerPortfolio.playerId, teamId));
    await trx
      .update(currentStocks)
      .set({ currentVolumeTraded: stockData.currentVolumeTraded - quantity })
      .where(eq(currentStocks.symbol, stockId));
  });
}
