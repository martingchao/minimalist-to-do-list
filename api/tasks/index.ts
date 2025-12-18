import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase') || process.env.DATABASE_URL?.includes('neon') || process.env.DATABASE_URL?.includes('railway') || process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
});

function getUserId(req: VercelRequest): number | null {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const decoded = jwt.verify(token, secret) as { userId: number };
    return decoded.userId;
  } catch {
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = getUserId(req);
  if (!userId) {
    return res.status(401).json({ error: 'Access token required' });
  }

  if (req.method === 'GET') {
    try {
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
  } else if (req.method === 'POST') {
    try {
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
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

