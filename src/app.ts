import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger';
import { jwtValidationMiddleware } from './middleware/jwtMiddleware';
import { nonceMiddleware } from './middleware/nonceMiddleware';
import { mtlsEnforcementPlaceholder } from './middleware/mtlsPlaceholder';
import cibaRouter from './routes/cibaRoutes';
import consentRouter from './routes/consentRoutes';
import mockRouter from './routes/mockRoutes';
import { signPayloadPlaceholder } from './utils/jws';

const app = express();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

const swaggerDocument = YAML.load(path.join(__dirname, '..', 'docs', 'openapi.yaml'));

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(requestLogger);
app.use(mtlsEnforcementPlaceholder);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Riyada Open Banking MVP ready' });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/demo', express.static(path.join(__dirname, '..', 'public')));

app.use('/ciba', jwtValidationMiddleware, nonceMiddleware, cibaRouter);
app.use('/consents', jwtValidationMiddleware, nonceMiddleware, consentRouter);
app.use('/mock', mockRouter);

app.post('/jws-signature', (req, res) => {
  const payload = req.body ?? {};
  res.json(signPayloadPlaceholder(payload));
});

export default app;
