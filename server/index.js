import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import choreRoutes from './routes/chores.js';
import teamRoutes from './routes/team.js';
import historyRoutes from './routes/history.js';
import { storageEmitter } from './services/storage.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/chores', choreRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/history', historyRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server, path: '/api/ws' });

storageEmitter.on('dataChanged', (filename) => {
  const type = filename.replace('.json', '');
  const message = JSON.stringify({ type });
  for (const client of wss.clients) {
    if (client.readyState === 1) {
      client.send(message);
    }
  }
});
