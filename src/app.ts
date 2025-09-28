import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { load } from 'js-yaml';

import { demoFlowHandler } from './example/demoFlow.js';
import { errorHandler } from './middleware/errorHandler.js';
import { globalRateLimiter } from './middleware/rateLimiter.js';
import { nonceIssueMiddleware } from './middleware/nonceMiddleware.js';
import { apiRoutes } from './routes/index.js';

export async function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(globalRateLimiter);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/demo-flow', nonceIssueMiddleware, demoFlowHandler);

  const openApiPath = resolve('docs/openapi.yaml');
  const openApiDocument = load(readFileSync(openApiPath, 'utf-8')) as Record<string, unknown>;
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use('/public', express.static(resolve('public')));
  app.use('/api', apiRoutes);

  app.use(errorHandler);

  return app;
}
