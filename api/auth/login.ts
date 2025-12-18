import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pg from 'pg';
const { Pool } = pg;

// Create pool with proper SSL configuration for Supabase
const getPoolConfig = () => {
  const connectionString = process.env.DATABASE_URL;
  
  // #region agent log
  console.log('[DEBUG] DATABASE_URL check:', {exists:!!connectionString,length:connectionString?.length||0,startsWithPostgres:connectionString?.startsWith('postgresql://')||false,startsWithPostgres2:connectionString?.startsWith('postgres://')||false});
  fetch('http://127.0.0.1:7242/ingest/1af345c8-de07-4c62-8c3b-6300f519029c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login.ts:getPoolConfig',message:'DATABASE_URL check',data:{exists:!!connectionString,length:connectionString?.length||0,startsWithPostgres:connectionString?.startsWith('postgresql://')||false,startsWithPostgres2:connectionString?.startsWith('postgres://')||false},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion
  
  if (!connectionString) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/1af345c8-de07-4c62-8c3b-6300f519029c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login.ts:getPoolConfig',message:'DATABASE_URL is missing',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    // #endregion
    return null;
  }

  // Extract hostname for logging
  let hostname = 'unknown';
  try {
    const url = new URL(connectionString);
    hostname = url.hostname;
  } catch (e) {
  // #region agent log
  console.error('[DEBUG] Failed to parse connection string:', e);
  fetch('http://127.0.0.1:7242/ingest/1af345c8-de07-4c62-8c3b-6300f519029c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login.ts:getPoolConfig',message:'Failed to parse connection string',data:{error:String(e)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
  // #endregion
  }

  // #region agent log
  const port = (() => { try { return new URL(connectionString).port; } catch { return 'unknown'; } })();
  const hasDbPrefix = connectionString.includes('db.');
  const hasPooler = connectionString.includes('pooler');
  console.log('[DEBUG] Connection string parsed:', {hostname,hasSupabase:connectionString.includes('supabase'),hasPooler,hasDbPrefix,port});
  fetch('http://127.0.0.1:7242/ingest/1af345c8-de07-4c62-8c3b-6300f519029c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login.ts:getPoolConfig',message:'Connection string parsed',data:{hostname,hasSupabase:connectionString.includes('supabase'),hasPooler,hasDbPrefix,port},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
  // #endregion

  // Check if using direct connection (db.) which doesn't work with Vercel
  if (hasDbPrefix && !hasPooler) {
    console.error('[ERROR] Using direct Supabase connection (db.*) which may not work with Vercel. Use Connection Pooling string instead.');
    console.error('[ERROR] Go to Supabase Dashboard → Settings → Database → Connection Pooling → Copy the "Transaction" or "Session" mode connection string');
  }

  const isSupabase = connectionString.includes('supabase');
  const isNeon = connectionString.includes('neon');
  const isRailway = connectionString.includes('railway');
  const isProduction = process.env.NODE_ENV === 'production';

  const config = {
    connectionString,
    ssl: isSupabase || isNeon || isRailway || isProduction
      ? { rejectUnauthorized: false }
      : false,
    // For Supabase connection pooling, set max connections
    max: isSupabase ? 1 : undefined,
  };

  // #region agent log
  console.log('[DEBUG] Pool config created:', {hostname,sslEnabled:!!config.ssl,maxConnections:config.max});
  fetch('http://127.0.0.1:7242/ingest/1af345c8-de07-4c62-8c3b-6300f519029c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login.ts:getPoolConfig',message:'Pool config created',data:{hostname,sslEnabled:!!config.ssl,maxConnections:config.max},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
  // #endregion

  return config;
};

const poolConfig = getPoolConfig();
const pool = poolConfig ? new Pool(poolConfig) : null;

// #region agent log
if (pool) {
  console.log('[DEBUG] Pool initialized successfully');
  fetch('http://127.0.0.1:7242/ingest/1af345c8-de07-4c62-8c3b-6300f519029c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login.ts:module-init',message:'Pool initialized',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
} else {
  console.error('[DEBUG] Pool NOT initialized');
  fetch('http://127.0.0.1:7242/ingest/1af345c8-de07-4c62-8c3b-6300f519029c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login.ts:module-init',message:'Pool NOT initialized',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
}
// #endregion

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

    // #region agent log
    console.log('[DEBUG] About to query database:', {email,poolExists:!!pool});
    fetch('http://127.0.0.1:7242/ingest/1af345c8-de07-4c62-8c3b-6300f519029c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login.ts:handler',message:'About to query database',data:{email,poolExists:!!pool},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    // Find user
    const result = await pool.query(
      'SELECT id, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/1af345c8-de07-4c62-8c3b-6300f519029c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login.ts:handler',message:'Query executed successfully',data:{rowsFound:result.rows.length},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });

    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error: any) {
    console.error('Login error:', error);
    
    // #region agent log
    console.error('[DEBUG] Error caught:', {errorCode:error?.code,errorMessage:error?.message,errorName:error?.name,hostname:error?.hostname,syscall:error?.syscall,errno:error?.errno});
    fetch('http://127.0.0.1:7242/ingest/1af345c8-de07-4c62-8c3b-6300f519029c',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'api/auth/login.ts:catch',message:'Error caught',data:{errorCode:error?.code,errorMessage:error?.message,errorName:error?.name,hostname:error?.hostname,syscall:error?.syscall,errno:error?.errno,stack:error?.stack?.substring(0,500)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // Check for DNS resolution error with direct Supabase connection
    if (error?.code === 'ENOTFOUND' && error?.hostname?.includes('db.') && error?.hostname?.includes('supabase')) {
      console.error('[ERROR] DNS resolution failed for direct Supabase connection. This is a known issue with Vercel.');
      console.error('[ERROR] SOLUTION: Use Supabase Connection Pooling instead of direct connection.');
      console.error('[ERROR] Steps:');
      console.error('[ERROR] 1. Go to Supabase Dashboard → Settings → Database');
      console.error('[ERROR] 2. Scroll to "Connection string" section');
      console.error('[ERROR] 3. Select "Transaction" mode (or "Session" mode)');
      console.error('[ERROR] 4. Copy the connection string (should contain "pooler.supabase.com")');
      console.error('[ERROR] 5. Update DATABASE_URL in Vercel with the pooler connection string');
    }
    
    // Log more details in development
    const errorMessage = process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error?.message || 'Internal server error';
    res.status(500).json({ error: errorMessage });
  }
}

