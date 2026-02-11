import express from 'express';
import * as historyService from '../services/historyService.js';

const router = express.Router();

// GET /api/history - Get completion history
router.get('/', async (req, res) => {
  try {
    const { memberId, choreId } = req.query;

    let history;
    if (memberId) {
      history = await historyService.getHistoryByMember(memberId);
    } else if (choreId) {
      history = await historyService.getHistoryByChore(choreId);
    } else {
      history = await historyService.getAllHistory();
    }

    res.json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

export default router;
