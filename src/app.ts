import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';

import { gameRoute } from './routes/game.route';
import { adminRoute } from './routes/admin.route';

const port = process.env.PORT ?? 8080;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(cors());
app.use(logger('dev'));

app.get('/', (req, res) => {
  res.send('<h1>Hello, World</h1>');
});

app.use('/admin', adminRoute);
app.use('/game', gameRoute);

const httpServer = app.listen(port, () => {
  console.log(`Server Listening to port: ${port}...`);
});

export { app, httpServer };
