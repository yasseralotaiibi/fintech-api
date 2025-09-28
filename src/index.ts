import { connectDatabase } from './config/db.js';
import { env, validateEnv } from './config/env.js';
import { logger } from './config/logger.js';
import { connectRedis } from './config/redis.js';
import { createApp } from './app.js';

async function bootstrap() {
  validateEnv();
  await connectDatabase();
  await connectRedis();

  const app = await createApp();

  app.listen(env.port, () => {
    logger.info(`Riyada Open Banking MVP listening on port ${env.port}`);
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to bootstrap application', { error });
  process.exit(1);
});
