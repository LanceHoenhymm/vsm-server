import express from 'express';
import 'express-async-errors';

const port = process.env.PORT ?? 8080;
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Hello, World</h1>');
});

function startServer() {
  app.listen(port, () => {
    console.log(`Server Listening to port: ${port}...`);
  });
}

startServer();
