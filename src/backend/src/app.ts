import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';

import routes from './routes';
import { env } from './config/env';
import { errorHandler } from './middleware/error-handler';
import { swaggerSpec } from './config/swagger';

const app = express();

// Security headers
app.use(helmet());

app.use((req,res,next)=>{
  next()
});

// CORS — restrict to allowed origins
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173'],
  credentials: true,
}));

// Body size limit to prevent payload DoS
app.use(express.json({ limit: '10kb' }));

// Swagger docs — only in non-production environments
if (env.nodeEnv !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'TMS API Docs',
    customCss: '.swagger-ui .topbar { display: none }',
  }));
}

// Routes
app.use('/api', routes);

// Error handling (must be last)
app.use(errorHandler);

export default app;
