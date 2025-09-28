import app from './app';
import { env } from './config/env';
import { connectRedis } from './config/redis';
import { logger } from './config/logger';

const start = async () => {
  try {
    await connectRedis();
    app.listen(env.port, () => {
      logger.info(`Riyada Open Banking MVP listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error({ error }, 'Failed to bootstrap application');
    process.exit(1);
  }
};

void start();
