import type { Server, Socket } from 'socket.io';
import type { ServerStockEventHandler } from '../types';

export function registerStockHandlers(io: Server, socket: Socket) {
  type StockData = { stock: string; amount: number };

  const onBuy: ServerStockEventHandler = (args, callback) => {
    const { stock, amount } = args as StockData;
    if (!stock || !amount) {
      callback({
        status: 'Failure',
        data: {
          err: 'Stock Name or Amount Invalid',
        },
      });
      return;
    }
  };

  const onSell: ServerStockEventHandler = (args, callback) => {
    const { stock, amount } = args as StockData;
    if (!stock || !amount) {
      callback({
        status: 'Failure',
        data: {
          err: 'Stock Name or Amount Invalid',
        },
      });
      return;
    }
    callback({
      status: 'Success',
      data: {
        msg: `${amount} of ${stock} sold`,
      },
    });
  };

  socket.on('game:buy', onBuy);
  socket.on('game:sell', onSell);
}
