import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';

import { Server } from 'socket.io';
import { createServer } from 'http';

import { initGame } from './game/game.js';
import { verifyToken } from './common/utils.js';

import { authRouter } from './controllers/auth/auth.router.js';
import { gameRouter } from './controllers/game/game.router.js';
import { authenticateRequest } from './middlewares/authenticate-request.js';
import { globalErrorHandler } from './middlewares/global-error-handler.js';

const port = process.env.PORT ?? 8080;
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
  path: '/game-updates',
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
app.use('/game', authenticateRequest, gameRouter);

app.use(globalErrorHandler);

io.engine.use(logger('dev'));
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

httpServer.listen(port, () => {
  console.log(`Server Listening to port: ${port}...`);
});

// initGame(io);

export { app, httpServer, io };
