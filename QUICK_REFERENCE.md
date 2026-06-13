# Quick Reference Guide

Essential commands and workflows for developing the Student Learning Analytics Platform.

## 🚀 Quick Start (TL;DR)

```bash
# Terminal 1: Backend
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate:dev
npm run seed
npm run dev

# Terminal 2: Frontend
cd frontend
npm install
npm run dev

# Open browser
# http://localhost:5173
# Login: student1@example.com / password123
```

## 📦 Installation Commands

```bash
# Install all dependencies (backend)
cd backend && npm install

# Install all dependencies (frontend)
cd frontend && npm install

# Clean install (removes node_modules)
rm -rf node_modules package-lock.json
npm install
```

## 🗄️ Database Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create database and apply migrations
npm run prisma:migrate:dev

# Deploy existing migrations (production)
npm run prisma:migrate:deploy

# Open database GUI (Prisma Studio)
npm run prisma:studio

# Seed sample data
npm run seed

# Reset database (delete and recreate)
rm dev.db
npm run prisma:migrate:dev
npm run seed

# View migration history
npm run prisma:migrate:status
```

## 🔧 Development Commands

### Backend

```bash
# Start development server (auto-reload)
npm run dev

# Start production server
npm start

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

### Frontend

```bash
# Start development server (HMR enabled)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests (when available)
npm test
```

## 🐛 Debugging

```bash
# View real-time server logs
npm run dev

# View database with GUI
npm run prisma:studio

# Open browser console
F12 → Console tab

# View network requests
F12 → Network tab

# Check environment variables
cat .env

# Test API endpoint
curl -X GET http://localhost:5000/api/courses
```

## 🔑 API Testing

```bash
# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@example.com","password":"password123"}'

# Get dashboard (replace TOKEN)
curl -X GET http://localhost:5000/api/analytics/dashboard \
  -H "Authorization: Bearer TOKEN"

# Get courses
curl -X GET http://localhost:5000/api/courses

# Enroll in course (replace courseId and TOKEN)
curl -X POST http://localhost:5000/api/courses/COURSE_ID/enroll \
  -H "Authorization: Bearer TOKEN"
```

## 👤 Default Credentials

```
# Students
Email: student1@example.com - student10@example.com
Password: password123

# Mentors
Email: mentor1@example.com - mentor3@example.com
Password: password123
```

## 📁 Project Structure Quick Reference

```
backend/
├── src/
│   ├── controllers/  ← HTTP request handlers
│   ├── services/     ← Business logic
│   ├── repositories/ ← Database access
│   ├── routes/       ← API endpoints
│   ├── middleware/   ← Express middleware
│   └── utils/        ← Helper functions
├── prisma/
│   └── schema.prisma ← Database schema
└── tests/            ← Unit tests

frontend/
├── src/
│   ├── components/   ← React components
│   ├── pages/        ← Page components
│   ├── hooks/        ← React Query hooks
│   ├── services/     ← API client
│   ├── context/      ← Global state
│   └── schemas/      ← Validation
└── index.html        ← Entry point
```

## 🎯 Common Tasks

### Add a New Environment Variable

**Backend:**
1. Edit `.env` file
2. Add variable: `MY_VAR=value`
3. Access in code: `process.env.MY_VAR`
4. Restart server

**Frontend:**
1. Edit `.env` file
2. Add variable: `VITE_MY_VAR=value` (must start with `VITE_`)
3. Access in code: `import.meta.env.VITE_MY_VAR`
4. Restart dev server

### Create a New API Endpoint

```javascript
// 1. Add route in backend/src/routes/newRoutes.js
router.get('/endpoint', auth, newController.getMethod);

// 2. Create controller in backend/src/controllers/newController.js
exports.getMethod = asyncHandler(async (req, res) => {
  const data = await newService.getData();
  sendSuccess(res, data, 200);
});

// 3. Create service in backend/src/services/NewService.js
class NewService {
  async getData() {
    const data = await newRepository.findAll();
    return data;
  }
}

// 4. Import route in backend/src/app.js
app.use('/api/new', require('./routes/newRoutes'));

// 5. Add hook in frontend/src/hooks/useAPI.js
export const useGetNewData = (options) => {
  return useQuery({
    queryKey: ['newData'],
    queryFn: () => api.newAPI.getData(),
    ...options
  });
};

// 6. Use in frontend component
const { data } = useGetNewData();
```

### Add a Database Model

```prisma
// 1. Edit prisma/schema.prisma
model NewModel {
  id           String   @id @default(cuid())
  name         String
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  
  @@index([userId])
}

// 2. Create migration
npm run prisma:migrate:dev

// 3. Prisma client auto-updates
```

### Debug Authentication Issues

```javascript
// Check token in browser console
localStorage.getItem('token')

// Check user in context
useAuth().user

// Test login endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student1@example.com","password":"password123"}'

// Verify token in Postman/Insomnia
Authorization: Bearer <TOKEN>
```

## 🚨 Troubleshooting Quick Fixes

```bash
# Port in use
# Windows PowerShell
Stop-Process -Name node -Force

# macOS/Linux
kill -9 $(lsof -t -i :5000)

# Module not found
rm -rf node_modules package-lock.json && npm install

# Database error
rm dev.db
npm run prisma:migrate:dev && npm run seed

# CORS error
# Ensure backend is running AND frontend CORS_ORIGIN is set correctly

# Frontend shows blank page
# Press Ctrl+Shift+R to hard refresh (clear cache)

# Changes not reflecting
# Restart backend: Ctrl+C then npm run dev
# Restart frontend: Ctrl+C then npm run dev
```

## 📊 File Size Quick Reference

After setup, typical sizes:

```
backend/
├── node_modules/    ~300 MB
├── src/             ~200 KB
└── dev.db           ~50 KB

frontend/
├── node_modules/    ~250 MB
├── src/             ~150 KB
└── dist/            ~200 KB (after build)
```

## 🔐 Environment Variables Checklist

### Backend

```
✓ DATABASE_URL - Path to SQLite or connection string
✓ JWT_SECRET - At least 32 characters, random
✓ JWT_EXPIRES_IN - Token expiry (e.g., 7d)
✓ PORT - Server port (5000)
✓ NODE_ENV - development or production
✓ CORS_ORIGIN - Allowed frontend origins
✓ BCRYPT_ROUNDS - Hashing rounds (10-12)
```

### Frontend

```
✓ VITE_API_URL - Backend URL (http://localhost:5000/api)
```

## 📈 Performance Tips

```bash
# Backend
├─ Use indexes on frequently queried fields
├─ Paginate large result sets
├─ Cache frequently accessed data
└─ Use specific select() in Prisma queries

# Frontend
├─ Use React.memo for expensive components
├─ Lazy load charts and heavy components
├─ Debounce search inputs
└─ Use React Query caching effectively
```

## 🧪 Testing Checklist

```bash
# Backend
✓ npm test                 # Run unit tests
✓ Check API endpoints      # Use curl or Postman
✓ Verify database state    # npm run prisma:studio
✓ Test error handling      # Submit invalid data

# Frontend
✓ Test login flow          # Check auth redirect
✓ Test navigation          # Verify routing works
✓ Test API integration     # Check network tab
✓ Test responsiveness      # Resize browser window
```

## 🎓 Code Patterns

### Backend - Service Method
```javascript
async enrollStudent(studentId, courseId) {
  // 1. Validate input
  if (!studentId || !courseId) {
    throw new ValidationError('Invalid input');
  }

  // 2. Check existing enrollment
  const existing = await this.enrollmentRepo.findOne({
    where: { studentId_courseId: { studentId, courseId } }
  });
  if (existing) throw new ConflictError('Already enrolled');

  // 3. Perform operation
  const enrollment = await this.enrollmentRepo.create({
    studentId,
    courseId,
    status: 'ACTIVE'
  });

  // 4. Side effects
  await this.activityService.logActivity(studentId, 'COURSE_STARTED');

  // 5. Return result
  return enrollment;
}
```

### Frontend - Custom Hook
```javascript
export const useEnrollCourse = () => {
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: (courseId) => 
      api.courses.enrollCourse(courseId),
    
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      toast.success('Enrolled successfully');
    },
    
    onError: (error) => {
      toast.error(error.message);
    }
  });
};
```

## 📚 Documentation Map

| Document | Purpose |
|----------|---------|
| [README.md](README.md) | Project overview |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design |
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Detailed setup |
| [backend/README.md](backend/README.md) | Backend docs |
| [frontend/README.md](frontend/README.md) | Frontend docs |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | This file |

## 🆘 Getting Help

1. **Check error message** - Read full error, not just first line
2. **Check troubleshooting section** - Likely has solution
3. **Check relevant README** - backend/ or frontend/
4. **Check SETUP_GUIDE.md** - Common issues section
5. **Review code comments** - Often explain why
6. **Check test files** - Show how to use code
7. **Use Prisma Studio** - Visualize database state

## 💡 Pro Tips

```javascript
// Use keyboard shortcuts
F12          // Open developer tools
Ctrl+Shift+R // Hard refresh (clear cache)
Ctrl+F5      // Full cache clear

// Use browser tools
Network tab  // See API calls
Console tab  // See errors
Storage tab  // View localStorage/cookies
Application → Service Workers (future)

// Use VS Code extensions
REST Client  // Test API without Postman
Thunder Client // In-editor API testing
Prisma       // Schema syntax highlighting
```

## 🔄 Workflow Example: Add New Feature

1. **Design**
   - Sketch UI
   - Plan database changes
   - Define API endpoints

2. **Database**
   - Update `prisma/schema.prisma`
   - Run migration: `npm run prisma:migrate:dev`

3. **Backend**
   - Create controller method
   - Create service method
   - Create repository query
   - Add route

4. **Frontend**
   - Create custom hook with React Query
   - Create page/component
   - Add form validation
   - Add navigation route

5. **Testing**
   - Manual testing in browser
   - Test error cases
   - Verify database state
   - Check API responses

6. **Cleanup**
   - Remove console.log()
   - Update types/interfaces
   - Add comments if complex
   - Commit with clear message

## 📊 Database Query Examples

```sql
-- Get student progress
SELECT u.email, COUNT(DISTINCT c.id) as enrollments,
  COUNT(CASE WHEN lp.status = 'COMPLETED' THEN 1 END) as completed
FROM User u
LEFT JOIN Enrollment e ON u.id = e.studentId
LEFT JOIN Course c ON e.courseId = c.id
LEFT JOIN LessonProgress lp ON e.id = lp.enrollmentId
GROUP BY u.id

-- Find inactive students
SELECT u.email, MAX(a.createdAt) as last_activity
FROM User u
LEFT JOIN Activity a ON u.id = a.userId
WHERE a.createdAt < DATE('now', '-30 days')
GROUP BY u.id
```

---

**This quick reference covers 90% of development tasks. Refer to specific READMEs for deeper information.**
