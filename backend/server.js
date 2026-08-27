import path from 'path';
import fs from 'fs';
import dns from 'dns';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env in development environment if dotenv is available
try {
  const dotenv = await import('dotenv');
  dotenv.default.config({ path: path.resolve(__dirname, '../.env') });
} catch (_) {
  // Production environment (Render/Railway/Vercel) already injects process.env variables natively
}

// Ensure DNS resolution fallback for MongoDB Atlas SRV lookup
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (_) {}

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import analyzeRoutes from './routes/analyze.js';
import uploadRoutes from './routes/upload.js';
import historyRoutes from './routes/history.js';
import sampleRoutes from './routes/samples.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.use('/api/analyze', analyzeRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/samples', sampleRoutes);

// Serve static frontend build if present (for single-service production deployments)
const frontendDist = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
} else {
  app.use(notFound);
}

app.use(errorHandler);

async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('MongoDB URI not set — history will be disabled.');
    return;
  }
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.warn('MongoDB connection failed — continuing without persistence:', err.message);
  }
}

connectMongo();

app.listen(PORT, () => {
  console.log(`Notice2Action API running on http://localhost:${PORT}`);
});
