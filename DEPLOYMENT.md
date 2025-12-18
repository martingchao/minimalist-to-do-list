# Deployment Guide

This guide will help you deploy your minimalist to-do list application to Vercel.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at [vercel.com](https://vercel.com))
3. A PostgreSQL database (Vercel Postgres, Neon, Supabase, or Railway)

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will automatically detect the project structure

### 3. Set Up PostgreSQL Database

#### Option A: Vercel Postgres (Recommended)

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database" and select "Postgres"
3. Choose a name for your database
4. Vercel will automatically create a `POSTGRES_URL` environment variable

#### Option B: External PostgreSQL Provider

1. Create a PostgreSQL database with any provider:
   - [Neon](https://neon.tech) (free tier available)
   - [Supabase](https://supabase.com) (free tier available)
   - [Railway](https://railway.app) (free tier available)
2. Copy your database connection string

### 4. Set Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

- **DATABASE_URL**: Your PostgreSQL connection string
  - For Vercel Postgres: Use the `POSTGRES_URL` that was automatically created
  - For external: Use your provider's connection string

- **JWT_SECRET**: A strong random string for JWT token signing
  - Generate one with: `openssl rand -base64 32`
  - Or use an online generator

### 5. Initialize the Database

After your first deployment, you need to run the database schema:

#### Using Vercel Postgres Dashboard:

1. Go to your Vercel project → Storage → Your Postgres database
2. Click on the "Data" tab
3. Use the SQL editor to run the contents of `backend/api/db/schema.sql`

#### Using psql (Command Line):

```bash
# Connect to your database
psql <your-database-url>

# Run the schema
\i backend/api/db/schema.sql
```

Or copy and paste the SQL from `backend/api/db/schema.sql` into your database's SQL editor.

### 6. Deploy

1. Vercel will automatically deploy when you push to your main branch
2. Or click "Deploy" in the Vercel dashboard
3. Wait for the build to complete

### 7. Test Your Deployment

1. Visit your deployed URL (e.g., `https://your-project.vercel.app`)
2. Register a new account
3. Create some tasks
4. Test all features (create, update, delete, complete tasks)

## Troubleshooting

### Database Connection Issues

- Verify your `DATABASE_URL` is correct
- Check that your database allows connections from Vercel's IP addresses
- For external databases, ensure SSL is enabled

### Build Errors

- Check the build logs in Vercel dashboard
- Ensure all dependencies are listed in `package.json`
- Verify TypeScript compilation succeeds locally first

### API Errors

- Check Vercel function logs in the dashboard
- Verify environment variables are set correctly
- Ensure the database schema has been initialized

## Local Development

To test locally before deploying:

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Set up `.env` file:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/todolist
   JWT_SECRET=your-secret-key
   ```

3. Initialize database:
   ```bash
   cd backend
   npm run init-db
   ```

4. Start development servers:
   ```bash
   npm run dev
   ```

## Updating Your Deployment

Simply push changes to your GitHub repository, and Vercel will automatically redeploy:

```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will detect the push and start a new deployment automatically.

