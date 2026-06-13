# Student Learning Analytics Platform - Backend

A production-grade Node.js/Express backend for tracking student learning progress, providing analytics, and generating adaptive learning recommendations.

## 🏗️ Architecture

### Layered Architecture Pattern

```
Routes → Controllers → Services → Repositories → Data Layer (Prisma/SQLite)
```

**Why this architecture?**
- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Services and repositories can be tested independently
- **Reusability**: Services can be used by different controllers
- **Maintainability**: Easy to locate and modify specific functionality
- **Scalability**: Can introduce caching, queuing, or microservices at any layer

### Layer Responsibilities

- **Routes**: Define HTTP endpoints and apply middleware
- **Controllers**: Handle HTTP requests/responses, delegate to services
- **Services**: Contain all business logic and domain rules
- **Repositories**: Manage data access and database queries
- **Data Layer**: ORM-level operations (Prisma)

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                 # Express application setup
│   ├── server.js              # Server startup and graceful shutdown
│   ├── config/
│   │   └── database.js        # Database connection management
│   ├── controllers/           # HTTP request handlers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── analyticsController.js
│   │   ├── recommendationController.js
│   │   └── activityController.js
│   ├── services/              # Business logic
│   │   ├── AuthService.js
│   │   ├── CourseService.js
│   │   ├── AnalyticsService.js
│   │   ├── RecommendationService.js
│   │   └── ActivityService.js
│   ├── repositories/          # Data access layer
│   │   └── index.js
│   ├── routes/                # API route definitions
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── analyticsRoutes.js
│   │   ├── recommendationRoutes.js
│   │   └── activityRoutes.js
│   ├── middleware/            # Express middleware
│   │   ├── errorHandler.js
│   │   ├── auth.js
│   │   └── validation.js
│   ├── validators/            # Request validation
│   │   └── index.js
│   ├── errors/                # Custom error classes
│   │   └── AppError.js
│   ├── utils/                 # Utility functions
│   │   ├── jwtUtils.js
│   │   ├── responseHelper.js
│   │   ├── pagination.js
│   │   └── asyncHandler.js
│   ├── constants/             # Application constants
│   │   └── index.js
│   └── database/
│       ├── migrations/        # Database migrations
│       └── seed/              # Database seeding
├── prisma/
│   └── schema.prisma          # Prisma schema
├── tests/                     # Test files
├── package.json
├── .env.example
└── README.md
```

## 🗄️ Database Schema

**Key Design Decisions:**

1. **SQLite with Prisma**: Lightweight, embedded database suitable for hackathons while maintaining production-quality ORM patterns
2. **User + Profile Separation**: Allows flexible role management without tight coupling
3. **Activity Events**: Denormalized for analytics performance
4. **Soft Deletes Pattern**: Using `onDelete: Cascade` for referential integrity
5. **Timestamps**: `createdAt` and `updatedAt` on all entities for audit trails

**Core Entities:**
- **User**: Authentication and authorization
- **StudentProfile / MentorProfile**: Role-specific data
- **Course → Section → Lesson**: Learning hierarchy
- **Enrollment**: Course-Student relationship with progress tracking
- **LessonProgress**: Detailed tracking of student progress per lesson
- **Activity**: Event log for analytics
- **StudentRecommendation**: Personalized recommendations

## 🔐 Security Features

- **Password Hashing**: bcrypt with configurable rounds
- **JWT Authentication**: Stateless authentication with access tokens
- **CORS Protection**: Configurable trusted origins
- **Helmet.js**: Security headers
- **Input Validation**: express-validator on all endpoints
- **Role-Based Authorization**: Middleware-enforced role checks
- **HTTP-only Cookies**: Token storage option

## 🔄 Data Flow Example: Course Enrollment

```
POST /api/courses/:courseId/enroll
  ↓
courseController.enrollCourse()
  ↓
courseService.enrollStudent(studentId, courseId)
  ├─ Verify course exists via courseRepository.findById()
  ├─ Check existing enrollment
  └─ Create enrollment + lessonProgress for all lessons
  ↓
activityService.logActivity() [COURSE_STARTED]
  ↓
sendSuccess() - Returns 201 with enrollment data
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone and setup:**
```bash
cd backend
npm install
```

2. **Environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Database setup:**
```bash
# Generate Prisma Client
npm run prisma:generate

# Create migrations (development)
npm run prisma:migrate:dev

# Or deploy existing migrations (production)
npm run prisma:migrate:deploy
```

4. **Seed sample data:**
```bash
npm run seed
```

### Running the Server

**Development:**
```bash
npm run dev
```
Server runs on `http://localhost:5000`

**Production:**
```bash
npm start
```

## 📚 API Documentation

### Authentication Endpoints

```bash
# Register
POST /api/auth/register
Body: { email, password, firstName, lastName, role }

# Login
POST /api/auth/login
Body: { email, password }

# Get Current User
GET /api/auth/me
Headers: { Authorization: Bearer <token> }

# Logout
POST /api/auth/logout
```

### Course Endpoints

```bash
# Get all courses
GET /api/courses?page=1&limit=10

# Get course details
GET /api/courses/:courseId

# Create course (mentor only)
POST /api/courses
Body: { title, description }

# Enroll in course (student only)
POST /api/courses/:courseId/enroll

# Get my enrollments (student)
GET /api/courses/my/enrollments

# Update lesson progress (student)
PUT /api/courses/progress/:progressId
Body: { status, timeSpent }
```

### Analytics Endpoints

```bash
# Dashboard summary (student)
GET /api/analytics/dashboard

# Course progress breakdown
GET /api/analytics/progress

# Daily learning activity
GET /api/analytics/daily-activity?days=7

# Weekly learning activity
GET /api/analytics/weekly-activity?weeks=4

# Activity history
GET /api/analytics/activity-history

# Mentor dashboard (mentor)
GET /api/analytics/mentor/overview
```

### Recommendation Endpoints

```bash
# Generate recommendations (student)
POST /api/recommendations/generate

# Get recommendations
GET /api/recommendations?page=1&limit=5

# Get next recommended lesson
GET /api/recommendations/next

# Mark recommendation as viewed
PUT /api/recommendations/:recommendationId/view
```

## 🧪 Testing

```bash
npm test
```

Tests cover:
- Authentication (registration, login, validation)
- Course enrollment logic
- Analytics calculations
- Recommendation generation

## 🎯 Key Design Decisions

### 1. JWT Authentication
**Why:** Stateless, scalable, suitable for REST APIs and future mobile clients
**Alternative:** Sessions with database storage

### 2. Prisma ORM
**Why:** Type-safe, intuitive API, excellent migrations, good for SQLite
**Alternative:** Raw SQL or other ORMs

### 3. Async Handlers
**Why:** Consistent error handling, cleaner code
**Alternative:** Explicit try-catch in every controller

### 4. Repository Pattern
**Why:** Abstraction layer for data access, testability, future database changes
**Alternative:** Direct service-database coupling

### 5. Activity Events Table
**Why:** Denormalized for analytics queries, audit trail
**Alternative:** Calculate on-the-fly from enrollments

## 🚀 Production Considerations

1. **Database**: Migrate to PostgreSQL/MySQL
2. **Caching**: Redis for dashboard and analytics
3. **Rate Limiting**: Implement per IP/user
4. **Monitoring**: Integrate error tracking (Sentry)
5. **Logging**: Structured logging (Winston/Pino)
6. **Containerization**: Docker for consistent deployments
7. **CI/CD**: GitHub Actions or similar
8. **Security**: 
   - HTTPS enforced
   - HSTS headers
   - Rate limiting
   - SQL injection prevention (handled by Prisma)
   - CSRF protection

## 📈 Scalability Roadmap

**Phase 1 (Current):**
- SQLite backend
- Single instance
- Synchronous processing

**Phase 2:**
- PostgreSQL database
- Redis caching
- Job queue (Bull/BullMQ) for analytics

**Phase 3:**
- Microservices architecture
- Event-driven (Kafka/RabbitMQ)
- Separate analytics service

**Phase 4:**
- Distributed system
- GraphQL API alternative
- Advanced ML-based recommendations

## 🔗 Backend-Frontend Communication

- **Base URL**: `http://localhost:5000/api`
- **Headers**: `Content-Type: application/json`, `Authorization: Bearer <token>`
- **Credentials**: Included for cookie authentication
- **Error Format**:
```json
{
  "success": false,
  "message": "Error message",
  "errors": [{ "field": "email", "message": "Invalid email" }]
}
```

## 📝 License

MIT
