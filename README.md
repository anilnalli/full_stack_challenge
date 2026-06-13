# 🎓 Student Learning Analytics Platform

A production-quality full-stack web application for tracking student learning progress, generating insights, and providing adaptive learning recommendations. Built with modern technologies following SOLID principles and enterprise architectural patterns.

## 🚀 Quick Start
- **Backend Server**: http://localhost:3000
- **Frontend Application**: http://localhost:5173

## 🌟 Features

### Student Features
- **📊 Personalized Dashboard**: Real-time metrics on learning progress
- **📚 Course Management**: Browse, enroll, and track courses
- **📈 Advanced Analytics**: Visualize learning patterns with interactive charts
- **💡 Smart Recommendations**: AI-driven next lesson suggestions
- **⏱️ Activity Tracking**: Automatic study time and engagement metrics
- **🔥 Streaks**: Motivational daily engagement tracking
- **📤 Export Data**: Download progress reports as CSV

### Mentor Features
- **👥 Student Overview**: Track all assigned students
- **⚠️ At-Risk Detection**: Identify struggling students
- **🏆 Performance Analytics**: View student performance metrics
- **📊 Course Insights**: Analytics on course effectiveness

### Technical Features
- ✅ **Type Safety**: Zod validation on frontend, express-validator on backend
- 🔐 **JWT Authentication**: Secure token-based auth
- 🗄️ **SQLite + Prisma**: Production-grade database with migrations
- 🎯 **Clean Architecture**: Layered architecture with separation of concerns
- 🧪 **Comprehensive Tests**: Unit tests for critical services
- 📱 **Responsive Design**: Mobile-first UI
- ⚡ **Performance**: Code splitting, caching, optimized queries

## 📁 Project Structure

```
full_stack_Challenge_1/
├── backend/                 # Node.js/Express API
│   ├── src/
│   │   ├── controllers/    # HTTP handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Data access
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   └── ...
│   ├── prisma/schema.prisma
│   ├── tests/              # Unit tests
│   └── README.md
│
├── frontend/                # React + Vite SPA
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks (React Query)
│   │   ├── services/       # API client
│   │   ├── context/        # Context API (Auth)
│   │   └── ...
│   ├── index.html
│   ├── vite.config.js
│   └── README.md
│
└── README.md (this file)
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+**
- **npm or yarn**
- **Git**

### 1. Clone Repository
```bash
git clone <repository-url>
cd full_stack_Challenge_1
```

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Initialize database
npm run prisma:generate
npm run prisma:migrate:dev

# Seed sample data
npm run seed

# Start development server
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Setup Frontend

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Setup environment (optional, defaults to localhost:5000)
cp .env.example .env

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Access Application

Open `http://localhost:5173` in your browser

**Demo Credentials:**
- **Student**: student1@example.com / password123
- **Mentor**: mentor1@example.com / password123

## 🏗️ Architecture Overview

### Backend Architecture

**Layered Architecture Pattern:**
```
HTTP Request
    ↓
Routes (with middleware)
    ↓
Controllers (req/res handling)
    ↓
Services (business logic)
    ↓
Repositories (data access)
    ↓
Prisma ORM
    ↓
SQLite Database
```

**Key Components:**
- **Express.js**: Web framework
- **Prisma**: ORM with migrations
- **SQLite**: Embedded database
- **JWT**: Stateless authentication
- **bcrypt**: Password hashing
- **express-validator**: Input validation

### Frontend Architecture

**Component-Based Architecture:**
```
App (Router)
    ↓
AuthContext (Global Auth)
    ↓
MainLayout (Navbar + Sidebar)
    ↓
Pages (Route Components)
    ↓
Components (Reusable UI)
    ↓
React Query (Server State)
    ↓
Axios (HTTP Client)
```

**Key Technologies:**
- **React 19**: UI library
- **Vite**: Build tool
- **React Router**: Routing
- **React Query**: Server state management
- **Material-UI**: Component library
- **Recharts**: Data visualization
- **Zod**: Validation
- **Axios**: HTTP client

## 🔐 Authentication Flow

1. **Register**: Create account with email, password, name, and role
2. **Login**: Authenticate with credentials
3. **JWT Generation**: Server issues access token
4. **Token Storage**: Frontend stores in localStorage
5. **Protected Routes**: Axios interceptor adds token to requests
6. **Authorization**: Role-based middleware on backend
7. **Logout**: Clear tokens and redirect to login

## 📊 Data Model

**User Roles:**
- **Student**: Can enroll in courses, track progress, receive recommendations
- **Mentor**: Can view student metrics, analyze cohorts

**Learning Hierarchy:**
- Course → Sections → Lessons → LessonProgress

**Activity Tracking:**
- Events: LESSON_STARTED, LESSON_COMPLETED, COURSE_STARTED, LOGIN, etc.
- Timestamps for all events

**Recommendations:**
- Based on incomplete lessons, course progress, recent activity
- Prioritized by engagement metrics

## 🧪 Testing

### Run Backend Tests
```bash
cd backend
npm test
```

**Test Coverage:**
- Authentication (register, login, validation)
- Course enrollment
- Analytics calculations
- Recommendation generation

### Frontend Testing (To be implemented)
```bash
cd frontend
npm test
```

## 📚 API Endpoints

### Authentication
```
POST   /api/auth/register        Register new user
POST   /api/auth/login           Login user
GET    /api/auth/me              Get current user
POST   /api/auth/logout          Logout user
```

### Courses
```
GET    /api/courses              Get all courses
GET    /api/courses/:id          Get course details
POST   /api/courses              Create course (mentor)
POST   /api/courses/:id/enroll   Enroll in course
GET    /api/courses/my/enrollments Get my courses
PUT    /api/courses/progress/:id Update lesson progress
```

### Analytics
```
GET    /api/analytics/dashboard           Dashboard summary
GET    /api/analytics/progress            Course progress
GET    /api/analytics/daily-activity      7-day activity
GET    /api/analytics/weekly-activity     Weekly trends
GET    /api/analytics/monthly-activity    Monthly trends
GET    /api/analytics/activity-history    Activity log
GET    /api/analytics/mentor/overview     Mentor dashboard
```

### Recommendations
```
POST   /api/recommendations/generate      Generate recommendations
GET    /api/recommendations               List recommendations
GET    /api/recommendations/next          Next recommended lesson
PUT    /api/recommendations/:id/view      Mark as viewed
```

**Complete API documentation available in [backend/README.md](backend/README.md)**

## 🎯 Design Decisions & Tradeoffs

### 1. SQLite Database
**Decision**: Use SQLite with Prisma ORM

**Why:**
- Lightweight, no separate server needed
- Perfect for hackathons/MVPs
- Excellent Prisma support
- Easy database migrations

**Tradeoff:**
- Limited to single-process concurrency
- Not suitable for massive scale
- **Upgrade Path**: PostgreSQL/MySQL in production

### 2. Layered Architecture
**Decision**: Routes → Controllers → Services → Repositories

**Why:**
- Clear separation of concerns
- Easy to test and maintain
- Business logic isolated from HTTP
- Can swap implementations

**Tradeoff:**
- More files than monolithic approach
- Initial setup overhead

### 3. React Query for Server State
**Decision**: Use @tanstack/react-query

**Why:**
- Automatic caching
- Background refetching
- Reduces boilerplate
- Production-grade

**Tradeoff:**
- Learning curve
- Another dependency

### 4. JWT Authentication
**Decision**: Stateless JWT tokens

**Why:**
- Scalable (no session store needed)
- Mobile-friendly
- Standard approach
- Works with microservices

**Tradeoff:**
- Can't revoke tokens mid-session
- Requires secure storage on client

### 5. Material-UI Components
**Decision**: Pre-built component library

**Why:**
- Professional appearance
- Accessible out-of-box
- Consistency
- Fast development

**Tradeoff:**
- Larger bundle size
- Limited customization
- Opinionated styling

## 📈 Performance Optimizations

### Backend
- Connection pooling via Prisma
- Query pagination
- Indexed database fields
- Efficient data structures

### Frontend
- Code splitting with Vite
- React Query caching
- Memoized components
- Lazy-loaded charts
- Debounced search

## 🔐 Security Measures

### Backend
- Password hashing with bcrypt
- JWT for authentication
- Role-based authorization
- Input validation (express-validator)
- CORS protection
- Helmet security headers
- Rate limiting ready

### Frontend
- XSS protection (React auto-escapes)
- Secure token handling
- HTTPS-ready
- CSP headers compatible

## 🚀 Production Deployment

### Backend
```bash
# Build
npm run build

# Deploy options
- Heroku
- AWS EC2/Lambda
- Google Cloud Run
- Azure App Service
```

### Frontend
```bash
# Build
npm run build

# Deploy options
- Vercel (recommended for Vite)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
```

### Database Migration (Production)
1. Export SQLite data
2. Import to PostgreSQL
3. Update connection string
4. Run migrations

## 📖 Documentation

- **[Backend README](backend/README.md)** - Detailed backend architecture, setup, and design decisions
- **[Frontend README](frontend/README.md)** - Frontend architecture, components, and features
- **[API Documentation](backend/README.md#-api-documentation)** - Complete API reference

## 🔄 Development Workflow

1. **Backend Changes**
   ```bash
   cd backend
   npm run dev  # Auto-reloads on changes
   ```

2. **Frontend Changes**
   ```bash
   cd frontend
   npm run dev  # HMR (Hot Module Replacement)
   ```

3. **Database Schema Changes**
   ```bash
   cd backend
   npm run prisma:migrate:dev
   ```

4. **Generate Sample Data**
   ```bash
   cd backend
   npm run seed
   ```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Backend (5000)
lsof -i :5000  # Find process
kill -9 <PID>  # Kill process

# Frontend (5173)
lsof -i :5173
kill -9 <PID>
```

### Database Issues
```bash
# Reset database (development only)
cd backend
rm dev.db
npm run prisma:migrate:dev
npm run seed
```

### CORS Errors
- Ensure backend is running on http://localhost:5000
- Check `CORS_ORIGIN` in `.env`
- Verify frontend is on http://localhost:5173

### Dependency Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🎓 Learning Outcomes

This project demonstrates:

- **Clean Code**: SOLID principles, DRY, meaningful naming
- **Architecture**: Layered architecture, separation of concerns
- **Full Stack**: Backend to frontend, database to UI
- **Modern Tech**: React 19, Express, Prisma, Vite
- **DevOps**: Docker-ready, CI/CD friendly, environment management
- **Best Practices**: Error handling, validation, testing
- **Scalability**: Design for future growth

## 📚 Tech Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19 |
| | Vite | 5 |
| | React Router | 6 |
| | React Query | 5 |
| | Material-UI | 5 |
| | Recharts | 2 |
| **Backend** | Node.js | 18+ |
| | Express | 4 |
| | Prisma | 5 |
| | SQLite | Latest |
| | JWT | jsonwebtoken 9 |
| **Tools** | Zod | 3 |
| | Axios | 1 |
| | bcrypt | 5 |

## 🤝 Contributing

Improvements welcome! Consider:
- Additional features
- Performance optimizations
- Better error handling
- More comprehensive tests
- Documentation improvements

## 📝 License

MIT License - See LICENSE file for details

## 🙋 Support

For questions or issues:
1. Check READMEs in backend and frontend folders
2. Review code comments
3. Check API documentation
4. Review test files for usage examples

---

**Built with ❤️ as a production-ready learning platform**

*Ready to track, analyze, and optimize student learning outcomes!*
