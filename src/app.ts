import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';

import { Server } from 'socket.io';
import { createServer } from 'http';

import { initGame } from './game/game';
import { getUnixTime, verifyToken } from './common/utils';

import { registerStockHandlers } from './gateways/stocks.gateway';
import { registerGameInfoHandler } from './gateways/game-info.gateway';

import { authRouter } from './controllers/auth/auth.router';
import { gameInitDelay } from './game/game-config';

const port = process.env.PORT ?? 8080;
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(logger('dev'));

app.get('/', (req, res) => {
  res.send('<h1>Hello, World</h1>');
});

app.use('/auth', authRouter);

io.use((socket, next) => {
  const token = socket.handshake.auth.token as string;
  try {
    verifyToken(token);
  } catch {
    next(new Error('Invalid Token'));
    return;
  }
  next();
});

io.on('connection', (socket) => {
  console.log('A user connected!');
  registerStockHandlers(io, socket);
  registerGameInfoHandler(io, socket);
});

httpServer.listen(port, () => {
  console.log(`Server Listening to port: ${port}...`);
});

initGame(getUnixTime() + gameInitDelay, io);

export { app, httpServer };
