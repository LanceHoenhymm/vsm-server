import { config } from 'dotenv';
config();

const envCacheTime = Number(process.env.CACHE_TIME);
export const cacheTime = isNaN(envCacheTime) ? 0 : envCacheTime;
