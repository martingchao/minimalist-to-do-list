import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import pg from 'pg';
const { Pool } = pg;

// Create pool with proper SSL configuration for Supabase
const getPoolConfig = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  const isSupabase = connectionString.includes('supabase');
  const isNeon = connectionString.includes('neon');
  const isRailway = connectionString.includes('railway');
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    connectionString,
    ssl: isSupabase || isNeon || isRailway || isProduction
      ? { rejectUnauthorized: false }
      : false,
    // For Supabase connection pooling, set max connections
    max: isSupabase ? 1 : undefined,
  };
};

const poolConfig = getPoolConfig();
const pool = poolConfig ? new Pool(poolConfig) : null;

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
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // #region agent log
  console.log('[DEBUG] Task [id] handler called:', {method:req.method,url:req.url,query:req.query,hasBody:!!req.body,body:req.body});
  // #endregion

  if (!pool) {
    console.error('Database pool not initialized');
    return res.status(500).json({ error: 'Database configuration error' });
  }

  const userId = getUserId(req);
  if (!userId) {
    // #region agent log
    console.error('[DEBUG] No userId from token');
    // #endregion
    return res.status(401).json({ error: 'Access token required' });
  }

  const taskId = parseInt(req.query.id as string);
  
  // #region agent log
  console.log('[DEBUG] Parsed taskId:', {taskId,rawId:req.query.id,userId});
  // #endregion

  if (isNaN(taskId)) {
    // #region agent log
    console.error('[DEBUG] Invalid taskId:', {rawId:req.query.id});
    // #endregion
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  if (req.method === 'PUT') {
    try {
      const { description, due_date, completed } = req.body;

      // #region agent log
      console.log('[DEBUG] Update task request:', {taskId,userId,body:{description:description!==undefined,due_date:due_date!==undefined,completed:completed!==undefined}});
      // #endregion

      // Verify task belongs to user
      const taskCheck = await pool.query(
        'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
        [taskId, userId]
      );

      if (taskCheck.rows.length === 0) {
        // #region agent log
        console.error('[DEBUG] Task not found or doesn\'t belong to user:', {taskId,userId});
        // #endregion
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
        // #region agent log
        console.error('[DEBUG] No fields to update');
        // #endregion
        return res.status(400).json({ error: 'No fields to update' });
      }

      updates.push(`updated_at = CURRENT_TIMESTAMP`);
      
      // Add taskId and userId to values, using consecutive parameter numbers
      const taskIdParam = paramCount;
      const userIdParam = paramCount + 1;
      values.push(taskId, userId);

      const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${taskIdParam} AND user_id = $${userIdParam} RETURNING *`;
      
      // #region agent log
      console.log('[DEBUG] Executing update query:', {query,values,paramCount,taskIdParam,userIdParam});
      // #endregion

      const result = await pool.query(query, values);

      // #region agent log
      console.log('[DEBUG] Update successful:', {rowsUpdated:result.rows.length});
      // #endregion

      res.json(result.rows[0]);
    } catch (error: any) {
      console.error('Update task error:', error);
      // #region agent log
      console.error('[DEBUG] Update task error details:', {errorCode:error?.code,errorMessage:error?.message,errorName:error?.name,stack:error?.stack?.substring(0,500)});
      // #endregion
      
      // Return more detailed error in development, generic in production
      const errorMessage = process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error?.message || 'Internal server error';
      res.status(500).json({ error: errorMessage });
    }
  } else if (req.method === 'DELETE') {
    try {
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
  } else {
    // #region agent log
    console.error('[DEBUG] Method not allowed:', {method:req.method,allowedMethods:['PUT','DELETE']});
    // #endregion
    res.status(405).json({ error: `Method ${req.method} not allowed. Use PUT or DELETE.` });
  }
}

