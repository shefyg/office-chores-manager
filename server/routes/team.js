import express from 'express';
import * as teamService from '../services/teamService.js';

const router = express.Router();

// GET /api/team - List all team members
router.get('/', async (req, res) => {
  try {
    const members = await teamService.getAllMembers();
    res.json(members);
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// POST /api/team - Add a new team member
router.post('/', async (req, res) => {
  try {
    const { name, email, color } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }
    const member = await teamService.createMember({ name, email, color });
    res.status(201).json(member);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// PUT /api/team/:id - Update a team member
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, color } = req.body;
    const member = await teamService.updateMember(id, { name, email, color });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// DELETE /api/team/:id - Remove a team member
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await teamService.deleteMember(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Member not found' });
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

export default router;
