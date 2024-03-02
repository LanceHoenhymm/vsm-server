import { type Server, type Socket } from 'socket.io';
import {
  getBalence,
  getPortfolio,
  getLeaderboard,
} from '../game/handlers/game-info-handlers';
import { ServerGameInfoEventHandler } from '../types';

export function registerGameInfoHandler(io: Server, socket: Socket) {
  const onLeaderboard: ServerGameInfoEventHandler = (callback) => {
    getLeaderboard()
      .then((data) => {
        callback({
          status: 'Success',
          data,
        });
      })
      .catch((err) => {
        callback({
          status: 'Failure',
          data: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            err,
          },
        });
      });
  };
  const onBalence: ServerGameInfoEventHandler = (callback) => {
    getBalence(socket.player.teamId)
      .then((data) => {
        callback({
          status: 'Success',
          data: {
            balence: data,
          },
        });
      })
      .catch((err) => {
        callback({
          status: 'Failure',
          data: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            err,
          },
        });
      });
  };
  const onPortfolio: ServerGameInfoEventHandler = (callback) => {
    getPortfolio(socket.player.teamId)
      .then((data) => {
        callback({
          status: 'Success',
          data: {
            portfolio: data,
          },
        });
      })
      .catch((err) => {
        callback({
          status: 'Failure',
          data: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            err,
          },
        });
      });
  };

  socket.on('game:leaderboard', onLeaderboard);
  socket.on('game:info', onBalence);
  socket.on('game:portfolio', onPortfolio);
}
