import express from 'express';
import * as choreService from '../services/choreService.js';

const router = express.Router();

// GET /api/chores - List all chores
router.get('/', async (req, res) => {
  try {
    const chores = await choreService.getAllChores();
    res.json(chores);
  } catch (error) {
    console.error('Error fetching chores:', error);
    res.status(500).json({ error: 'Failed to fetch chores' });
  }
});

// GET /api/chores/:id - Get a specific chore
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const chore = await choreService.getChoreById(id);
    if (!chore) {
      return res.status(404).json({ error: 'Chore not found' });
    }
    res.json(chore);
  } catch (error) {
    console.error('Error fetching chore:', error);
    res.status(500).json({ error: 'Failed to fetch chore' });
  }
});

// POST /api/chores - Create a new chore
router.post('/', async (req, res) => {
  try {
    const { title, description, assigneeId, priority, notes, dueDate, dueTime, recurrence } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!dueDate) {
      return res.status(400).json({ error: 'Due date is required' });
    }
    const chore = await choreService.createChore({
      title,
      description,
      assigneeId,
      priority,
      notes,
      dueDate,
      dueTime,
      recurrence
    });
    res.status(201).json(chore);
  } catch (error) {
    console.error('Error creating chore:', error);
    res.status(500).json({ error: 'Failed to create chore' });
  }
});

// PUT /api/chores/:id - Update a chore
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, assigneeId, priority, notes, status, dueDate, dueTime, recurrence } = req.body;
    const chore = await choreService.updateChore(id, {
      title,
      description,
      assigneeId,
      priority,
      notes,
      status,
      dueDate,
      dueTime,
      recurrence
    });
    if (!chore) {
      return res.status(404).json({ error: 'Chore not found' });
    }
    res.json(chore);
  } catch (error) {
    console.error('Error updating chore:', error);
    res.status(500).json({ error: 'Failed to update chore' });
  }
});

// DELETE /api/chores/:id - Delete a chore
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await choreService.deleteChore(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Chore not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chore:', error);
    res.status(500).json({ error: 'Failed to delete chore' });
  }
});

// POST /api/chores/:id/complete - Mark a chore as complete
router.post('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const result = await choreService.completeChore(id, notes);
    if (!result) {
      return res.status(404).json({ error: 'Chore not found' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error completing chore:', error);
    res.status(500).json({ error: 'Failed to complete chore' });
  }
});

export default router;
