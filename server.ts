import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import matchHandler from './api/match.js';
import pokemonHandler from './api/pokemon.js';
import healthHandler from './api/health.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware for parsing JSON with up to 10MB payload (for image transfers)
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // API Routes matching Vercel serverless function signatures
  app.all('/api/match', async (req, res) => {
    try {
      await matchHandler(req, res);
    } catch (err) {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error during match.' });
      }
    }
  });

  app.all('/api/pokemon', async (req, res) => {
    try {
      await pokemonHandler(req, res);
    } catch (err) {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error fetching Pokémon.' });
      }
    }
  });

  // Health check endpoint
  app.all('/api/health', async (req, res) => {
    try {
      await healthHandler(req, res);
    } catch (err) {
      if (!res.headersSent) {
        res.status(500).json({ error: 'Internal server error during health check.' });
      }
    }
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PokéLook server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
