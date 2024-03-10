import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';

import { Server } from 'socket.io';
import { createServer } from 'http';

import { port, allowedOrigin } from './common/app-config.js';

import { authRouter } from './controllers/auth/auth.router.js';
import { gameRouter } from './controllers/game/game.router.js';
import {
  authenticateRequest,
  authenticateSocket,
} from './middlewares/authenticate-request.js';
import { globalErrorHandler } from './middlewares/global-error-handler.js';

import { initGame } from './game/game.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigin,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(
  cors({
    origin: allowedOrigin,
  }),
);
app.use(logger('dev'));

app.get('/', (req, res) => {
  res.send('<h1>Hello, World</h1>');
});

app.use('/auth', authRouter);
app.use('/game', authenticateRequest, gameRouter);

app.use(globalErrorHandler);

io.engine.use(logger('dev'));
io.use(authenticateSocket);

httpServer.listen(port, () => {
  console.log(`Server Listening to port: ${port}...`);
});

initGame(io);

export { app, httpServer, io };
