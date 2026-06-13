# Complete Setup Guide

A comprehensive step-by-step guide to setting up the Student Learning Analytics Platform from scratch.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Verification](#verification)
5. [Common Issues & Troubleshooting](#common-issues--troubleshooting)
6. [Running in Production Mode](#running-in-production-mode)
7. [Database Management](#database-management)

## Prerequisites

### System Requirements

- **OS**: Windows, macOS, or Linux
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher (comes with Node.js)
- **Disk Space**: Minimum 2GB
- **RAM**: Minimum 4GB (8GB recommended)

### Verify Your System

```bash
# Check Node.js version
node --version
# Should output: v18.0.0 or higher

# Check npm version
npm --version
# Should output: 9.0.0 or higher
```

### Installation of Node.js

If you don't have Node.js installed:

**Windows:**
1. Visit https://nodejs.org/
2. Download LTS version
3. Run installer
4. Follow wizard (use default settings)
5. Restart terminal/PowerShell
6. Verify installation

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm
```

## Backend Setup

### Step 1: Navigate to Backend Directory

```bash
cd backend
```

### Step 2: Install Dependencies

```bash
npm install
```

**What this does:**
- Downloads all packages listed in `package.json`
- Creates `node_modules` folder
- Generates `package-lock.json` for consistency

**Expected output:**
```
added 150+ packages in ~30s
```

### Step 3: Setup Environment Variables

```bash
# Create .env file from template
cp .env.example .env
```

**Edit .env file with:**

```
# Database
DATABASE_URL="file:./dev.db"

# JWT Configuration
JWT_SECRET="your-super-secret-key-min-32-chars"
JWT_EXPIRES_IN="7d"

# Server
PORT=5000
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:5173,http://localhost:3000"

# Bcrypt
BCRYPT_ROUNDS=10

# Logging
LOG_LEVEL="debug"
```

**Important:** In production, use strong random values for `JWT_SECRET`

```bash
# Generate a strong random secret (on any system)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Generate Prisma Client

```bash
npm run prisma:generate
```

**What this does:**
- Generates Prisma Client from schema
- Creates TypeScript types
- Required before first database access

**Expected output:**
```
Prisma Client has been updated in [path]
```

### Step 5: Initialize Database

**Option A: Development (creates schema + migrations)**
```bash
npm run prisma:migrate:dev
```

**What this does:**
- Creates migration files
- Applies migrations to database
- Creates `dev.db` file in root

**When prompted, enter migration name:**
```
? Enter a name for this migration: initial
```

**Option B: Production (applies existing migrations)**
```bash
npm run prisma:migrate:deploy
```

**Expected output:**
```
2 migrations have been applied
✓ Generated Prisma Client in [path]
```

### Step 6: Seed Sample Data (Optional but Recommended)

```bash
npm run seed
```

**What this creates:**
- 10 student accounts
- 3 mentor accounts
- 8 courses with sections and lessons
- 24 lesson progress records
- 300+ activity records
- Student recommendations

**Demo Credentials after seeding:**
- Student: `student1@example.com` / `password123`
- Mentor: `mentor1@example.com` / `password123`

**Expected output:**
```
✓ Seeded database successfully
- Created 10 students
- Created 3 mentors
- Created 8 courses with 50 lessons
- Generated 300 activity records
```

### Step 7: Start Backend Server

```bash
npm run dev
```

**Expected output:**
```
➜  Backend listening on http://localhost:5000
✓ Database connected
```

**Server will automatically restart on file changes (hot reload)**

### Verification - Backend Running

Open new terminal and test:

```bash
# Test health check
curl http://localhost:5000/health

# Or in PowerShell
Invoke-WebRequest -Uri http://localhost:5000/health

# Expected response:
# {"success": true, "message": "Server is running"}
```

## Frontend Setup

### Step 1: Navigate to Frontend Directory

Open **new terminal window** (keep backend running)

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

**Expected output:**
```
added 130+ packages in ~25s
```

### Step 3: Setup Environment Variables

```bash
# Create .env file from template
cp .env.example .env
```

**Check .env file:**

```
VITE_API_URL=http://localhost:3000/api
```

This tells Vite to proxy `/api` requests to your backend.

**Note:** Frontend is on port 5173, backend is on 3000. The proxy handles communication.

### Step 4: Start Frontend Dev Server

```bash
npm run dev
```

**Expected output:**
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

## Verification

### Test Login Flow

1. Open browser to `http://localhost:5173`
2. You should see login page
3. Enter credentials:
   - Email: `student1@example.com`
   - Password: `password123`
4. Click "Login"
5. Should redirect to dashboard with welcome message

### Test API Endpoints

```bash
# Get auth token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@example.com","password":"password123"}'

# Response:
# {
#   "success": true,
#   "data": {
#     "token": "eyJhbGciOiJIUzI1NiIs...",
#     "user": { ... }
#   }
# }

# Get dashboard data (replace TOKEN with actual token)
curl -X GET http://localhost:3000/api/analytics/dashboard \
  -H "Authorization: Bearer TOKEN"
```

### Verify Database

```bash
# Open backend directory
cd backend

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

This opens `http://localhost:5555` where you can:
- View all database records
- Add/edit/delete data
- Query relationships

## Common Issues & Troubleshooting

### Issue: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solutions:**

**Windows (PowerShell):**
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000 | Select-Object OwnerModule

# Kill the process
Stop-Process -Name node -Force

# Or use different port
PORT=5001 npm run dev
```

**macOS/Linux:**
```bash
# Find process using port 5000
lsof -i :5000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### Issue: Module Not Found

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database Connection Failed

**Error:**
```
Error: ENOENT: no such file or directory, open 'dev.db'
```

**Solution:**
```bash
# Generate Prisma client
npm run prisma:generate

# Create database
npm run prisma:migrate:dev

# Seed data
npm run seed
```

### Issue: CORS Error in Browser

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solutions:**

1. **Check backend is running:**
   ```bash
   # In backend directory
   npm run dev
   ```

2. **Check .env CORS_ORIGIN:**
   ```
   CORS_ORIGIN="http://localhost:5173,http://localhost:3000"
   ```

3. **Restart both servers:**
   - Stop backend (Ctrl+C)
   - Stop frontend (Ctrl+C)
   - Start backend: `npm run dev` (in backend folder)
   - Start frontend: `npm run dev` (in frontend folder)

### Issue: JWT Token Expired Error

**Error:**
```
401 Unauthorized: Token expired
```

**Solution:**
- Log out and log back in
- Token lasts 7 days by default

### Issue: 404 When Accessing Frontend

**Error:**
```
Cannot GET /
```

**Check:**
1. Frontend is running on `http://localhost:5173`
2. Not `http://localhost:5000`
3. Press Ctrl+C to stop, then `npm run dev` to restart

### Issue: Vite Proxy Not Working

**Error:**
```
GET /api/... 404 or ERR_NAME_NOT_RESOLVED
```

**Check vite.config.js:**
```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      rewrite: (path) => path // Keep /api prefix
    }
  }
}
```

### Issue: Password Hashing Takes Long

**Cause:**
- BCRYPT_ROUNDS=10 (default, secure)
- First-time hash takes 1-2 seconds

**Solution:**
- This is expected behavior
- Increase BCRYPT_ROUNDS only if needed (higher = slower)

## Running in Production Mode

### Build Backend

```bash
cd backend

# Build (if needed)
npm run build

# Start production server
npm start

# Should output:
# ✓ Backend listening on http://localhost:3000
# ✓ Database connected
```

### Build Frontend

```bash
cd frontend

# Build (creates optimized dist folder)
npm run build

# Test production build locally
npm run preview

# Should open http://localhost:4173
```

### Environment Variables (Production)

**Backend .env:**
```
DATABASE_URL="postgresql://user:password@db-host/dbname"
JWT_SECRET="production-random-secret-min-32-chars"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV="production"
CORS_ORIGIN="https://yourdomain.com"
BCRYPT_ROUNDS=12
LOG_LEVEL="info"
```

**Frontend .env:**
```
VITE_API_URL=https://api.yourdomain.com
```

### Deployment Checklist

- [ ] Backend database migrated to PostgreSQL/MySQL
- [ ] JWT_SECRET set to strong random value
- [ ] CORS_ORIGIN set to production domain
- [ ] Database backups configured
- [ ] SSL/TLS certificates installed
- [ ] Environment variables set correctly
- [ ] Logging and monitoring configured
- [ ] Error tracking (Sentry) set up
- [ ] Rate limiting configured
- [ ] Security headers verified

## Database Management

### View Database

```bash
cd backend

# Open Prisma Studio (GUI)
npm run prisma:studio
```

### Reset Database (Development)

```bash
cd backend

# Remove database file
rm dev.db

# Recreate and migrate
npm run prisma:migrate:dev

# Reseed data
npm run seed
```

### Create New Migration

```bash
cd backend

# After modifying prisma/schema.prisma:
npm run prisma:migrate:dev

# Enter migration name when prompted
```

### View Migration History

```bash
cd backend

# List all migrations
npm run prisma:migrate:status
```

### Export Database to CSV

```bash
# Use Prisma Studio (easier option)
npm run prisma:studio

# Or via API endpoint
curl -X GET http://localhost:5000/api/activities/export \
  -H "Authorization: Bearer TOKEN" \
  > activities.csv
```

## Development Workflow

### Daily Development Session

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3 (optional): Database
cd backend
npm run prisma:studio
```

### Making Database Changes

1. Edit `backend/prisma/schema.prisma`
2. Run: `npm run prisma:migrate:dev`
3. Enter migration name
4. Frontend will auto-refresh (HMR)

### Making API Changes

1. Edit files in `backend/src`
2. Backend auto-reloads (nodemon)
3. Test in Postman or browser

### Making UI Changes

1. Edit files in `frontend/src`
2. Frontend auto-reloads (HMR)
3. See changes instantly

## Testing

### Run Backend Tests

```bash
cd backend
npm test

# Expected output:
# ✓ AuthService (4 tests)
# ✓ CourseService (3 tests)
# ✓ AnalyticsService (2 tests)
# ...
# Tests:  13 passed (50ms)
```

### Verify Frontend Functionality

Manual testing checklist:
- [ ] Login with demo credentials
- [ ] See dashboard with stats
- [ ] View courses page
- [ ] Enroll in a course
- [ ] Check analytics page
- [ ] View recommendations
- [ ] Test logout
- [ ] Switch to mentor account
- [ ] View mentor dashboard

## Getting Help

### Check Logs

**Backend logs:**
```bash
# Terminal shows real-time logs
# Look for ERROR or WARN messages
```

**Frontend console:**
```
Press F12 → Console tab → Look for errors/warnings
```

### Review Documentation

- [README.md](../README.md) - Project overview
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System design
- [backend/README.md](../backend/README.md) - Backend architecture
- [frontend/README.md](../frontend/README.md) - Frontend architecture

### Check Configuration

```bash
# Backend config
cat .env

# Frontend config
cat frontend/.env

# Database schema
cat prisma/schema.prisma
```

## Next Steps

1. ✅ **Follow this guide** to set up locally
2. 📖 **Read ARCHITECTURE.md** to understand design
3. 🔍 **Explore the codebase** to learn patterns
4. 🧪 **Run tests** to verify everything works
5. 🚀 **Deploy** following production checklist
6. 📚 **Contribute** by improving features

---

**Setup complete! You now have a production-grade full-stack application running locally.**

If you encounter any issues, refer back to the "Common Issues & Troubleshooting" section or check the relevant README files.

Happy coding! 🎉
