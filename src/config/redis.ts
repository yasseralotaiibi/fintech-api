import Redis from 'ioredis';

import { env } from './env.js';
import { logger } from './logger.js';

export const redisClient = new Redis(env.redisUrl, {
  lazyConnect: true,
});

redisClient.on('connect', () => logger.info('Connected to Redis'));
redisClient.on('error', (error) => logger.error('Redis connection error', { error }));

export async function connectRedis(): Promise<void> {
  if (!redisClient.status || redisClient.status === 'wait') {
    await redisClient.connect();
  }
}
