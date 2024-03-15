import { config } from 'dotenv';
config();

const port = 8080;
const allowedOrigin = '*';

export { port, allowedOrigin };
