import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check environment variables
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not set');
    return res.status(500).json({ error: 'Database configuration error' });
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not set');
    return res.status(500).json({ error: 'JWT configuration error' });
  }

  if (!pool) {
    console.error('Database pool not initialized');
    return res.status(500).json({ error: 'Database configuration error' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
      [email, passwordHash]
    );

    const user = result.rows[0];

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });

    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  } catch (error: any) {
    console.error('Registration error:', error);
    // Log more details in development
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error?.message || 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
}

