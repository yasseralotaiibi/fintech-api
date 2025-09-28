import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

const prisma = new PrismaClient();

prisma
  .$connect()
  .then(() => {
    logger.info('Connected to Postgres via Prisma');
  })
  .catch((error) => {
    logger.error({ error }, 'Failed to connect to Postgres');
  });

export { prisma };
