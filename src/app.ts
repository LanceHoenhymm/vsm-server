import express from 'express';
import 'express-async-errors';
import { Server } from 'socket.io';
import { createServer } from 'http';

import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import {
  authenticateRequest,
  authenticateSocket,
} from './middlewares/authenticator.middleware.js';
import { authorizeRequest } from './middlewares/authorizer.middleware.js';
import { globalErrorHandler } from './middlewares/error-handler.middleware.js';

import { authRouter } from './controllers/auth/auth.router.js';
import { gameRouter } from './controllers/game/game.router.js';
import { adminRouter } from './controllers/admin/admin.router.js';

import { config } from 'dotenv';
config();

const port = process.env.PORT || 8080;
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';

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
io.engine.use(helmet());
io.use(authenticateSocket);

httpServer.listen(port, () => {
  console.log(`Server Listening to port: ${port}...`);
});
