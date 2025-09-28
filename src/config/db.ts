import { PrismaClient } from '@prisma/client';

import { logger } from './logger.js';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    logger.info('Connected to Postgres via Prisma');
  } catch (error) {
    logger.error('Failed to connect to Postgres', { error });
    throw error;
  }
}
