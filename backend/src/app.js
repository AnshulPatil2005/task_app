import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';
import swaggerUi from 'swagger-ui-express';
import router from './routes/v1/index.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, 'docs', 'swagger.yaml');
const swaggerDocument = yaml.parse(fs.readFileSync(swaggerPath, 'utf-8'));

const app = express();

app.disable('x-powered-by');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const configuredOrigins =
  process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean) || [];
const allowedOrigins = configuredOrigins.length ? configuredOrigins : ['http://localhost:5173'];

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(helmet());
app.use(apiLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'OK',
    data: { uptime: process.uptime() },
    errors: null,
  });
});

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/v1', router);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    data: null,
    errors: { path: req.originalUrl },
  });
});

app.use(errorHandler);

export default app;
