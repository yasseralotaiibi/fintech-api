import Redis from 'ioredis';
import { env } from './env';
import { logger } from './logger';

export const redis = new Redis(env.redisUrl, { lazyConnect: true });

redis.on('error', (error) => {
  logger.error({ error }, 'Redis error encountered');
});

redis.on('connect', () => {
  logger.info('Connected to Redis');
});

export const connectRedis = async (): Promise<void> => {
  if (redis.status !== 'ready' && redis.status !== 'connecting') {
    await redis.connect();
  }
};

export default redis;
