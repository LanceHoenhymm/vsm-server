import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import { config } from 'dotenv';

import { Server } from 'socket.io';
import { createServer } from 'http';

import { port, allowedOrigin } from './common/app-config.js';

import { authRouter } from './controllers/auth/auth.router.js';
import { gameRouter } from './controllers/game/game.router.js';
import { adminRouter } from './controllers/admin/admin.router.js';

import {
  authenticateRequest,
  authenticateSocket,
} from './middlewares/authenticate-request.js';
import { authorizeRequest } from './middlewares/authorize-request.js';
import { globalErrorHandler } from './middlewares/global-error-handler.js';

import { game, registerGameNotifier } from './game/game.js';

import { checkRunningPollTime } from './common/app-config.js';

config();

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
app.use('/admin', authenticateRequest, authorizeRequest, adminRouter);
app.use('/game', authenticateRequest, gameRouter);

app.use(globalErrorHandler);

io.engine.use(logger('dev'));
io.use(authenticateSocket);

httpServer.listen(port, () => {
  console.log(`Server Listening to port: ${port}...`);
});

const intervalId = setInterval(() => {
  if (process.env.GAME_STATE == 'Running') {
    console.log('Game is running now');
    registerGameNotifier(io);
    game();
    clearInterval(intervalId);
  }
}, checkRunningPollTime * 1000);
