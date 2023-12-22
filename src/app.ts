import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';

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

function startServer() {
  app.listen(port, () => {
    console.log(`Server Listening to port: ${port}...`);
  });
}

startServer();
