import express from 'express';
import cors from 'cors';
import choreRoutes from './routes/chores.js';
import teamRoutes from './routes/team.js';
import historyRoutes from './routes/history.js';

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
