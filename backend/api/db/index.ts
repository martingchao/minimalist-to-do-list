import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

// Load .env from root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: envPath });

const { Pool } = pg;

// Debug: Check if DATABASE_URL is loaded (hide password)
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set in environment variables');
  console.error('Make sure your .env file is in the root directory and contains DATABASE_URL');
  console.error('Looking for .env at:', envPath);
} else {
  // Log connection string without password for debugging
  const url = process.env.DATABASE_URL;
  const maskedUrl = url.replace(/:([^:@]+)@/, ':****@');
  console.log('Database URL (masked):', maskedUrl);
}

// Check if DATABASE_URL uses https (wrong format) or postgresql (correct)
const dbUrl = process.env.DATABASE_URL || '';
if (dbUrl.startsWith('https://')) {
  console.error('ERROR: DATABASE_URL appears to be using https:// instead of postgresql://');
  console.error('Please use the PostgreSQL connection string, not the REST API URL');
  console.error('In Supabase: Go to Settings → Database → Connection string → URI');
}

// Check for common connection string issues
if (dbUrl.includes(']@') || dbUrl.includes('[@')) {
  console.warn('WARNING: Connection string may have formatting issues with brackets or special characters');
  console.warn('If your password contains special characters, they need to be URL-encoded');
  console.warn('Common encodings: @ = %40, # = %23, % = %25, & = %26, / = %2F, : = %3A, [ = %5B, ] = %5D');
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Enable SSL for cloud databases (Supabase, Neon, etc.)
  ssl: dbUrl.includes('supabase') || dbUrl.includes('neon') || dbUrl.includes('railway') || process.env.NODE_ENV === 'production' 
    ? { rejectUnauthorized: false } 
    : false,
});

export default pool;

