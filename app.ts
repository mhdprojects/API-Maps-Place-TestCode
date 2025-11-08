import express from 'express';
import cors from 'cors';
import routes from './routes/places.js';
import { ENV } from './config/env.js';
import { renderMapPage } from './pages/main-page.js';
import path from 'path';
import fs from 'fs';

export function createApp() {
  const app = express();

  const origins = ENV.ALLOWED_ORIGINS;
  app.use(cors({
    origin: origins.length ? origins : true
  }));

  app.use(express.json());

  app.use((req, res, next) => {
    const start = Date.now();
    const ip = (req.headers['x-forwarded-for'] || req.ip || (req.socket && req.socket.remoteAddress)) as string || '';
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.url} ${res.statusCode} - ${ip} - ${duration}ms`
      );
    });
    next();
  });

  app.get('/map', (req, res) => {
    const embed = String(req.query.embed_url || '');
    if (!embed.startsWith('https://www.google.com/maps/embed/')) {
      return res.status(400).send('Invalid embed url');
    }
    
    return res.send(renderMapPage(embed));
  });

  app.get('/openapi.json', (_req, res) => {
    const spec = fs.readFileSync(path.join(process.cwd(), 'openapi.json'), 'utf8');

    res.type('application/json').send(spec);
  });

  app.use('/api', routes);

  return app;
}
