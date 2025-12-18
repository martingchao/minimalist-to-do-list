import express from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';
import pool from '../db/index.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all tasks for the authenticated user
router.get('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { sort } = req.query;

    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const params: any[] = [userId];

    if (sort === 'due_date') {
      query += ' ORDER BY due_date ASC NULLS LAST, created_at DESC';
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new task
router.post('/', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const { description, due_date } = req.body;

    if (!description || description.trim() === '') {
      return res.status(400).json({ error: 'Task description is required' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (user_id, description, due_date) VALUES ($1, $2, $3) RETURNING *',
      [userId, description.trim(), due_date || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a task
router.put('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const taskId = parseInt(req.params.id);
    const { description, due_date, completed } = req.body;

    // Verify task belongs to user
    const taskCheck = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
      [taskId, userId]
    );

    if (taskCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (description !== undefined) {
      updates.push(`description = $${paramCount++}`);
      values.push(description.trim());
    }

    if (due_date !== undefined) {
      updates.push(`due_date = $${paramCount++}`);
      values.push(due_date || null);
    }

    if (completed !== undefined) {
      updates.push(`completed = $${paramCount++}`);
      values.push(completed);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(taskId, userId);

    const result = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${paramCount++} AND user_id = $${paramCount++} RETURNING *`,
      values
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a task
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const userId = req.userId!;
    const taskId = parseInt(req.params.id);

    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
      [taskId, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

