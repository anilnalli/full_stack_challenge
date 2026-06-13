# Architecture Documentation

## System Architecture

This document provides a comprehensive overview of the Student Learning Analytics Platform architecture, design patterns, and decision rationale.

## 1. System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  Student Learning Analytics Platform                        │
│                                                               │
│  ┌──────────────────┐            ┌──────────────────────┐   │
│  │                  │            │                      │   │
│  │  React Frontend  │◄──────────►│  Express Backend     │   │
│  │  - Vite          │   HTTP/   │  - Node.js           │   │
│  │  - React Query   │   REST    │  - Prisma ORM        │   │
│  │  - Material-UI   │           │  - SQLite            │   │
│  │                  │           │                      │   │
│  └──────────────────┘           └──────────────────────┘   │
│                                         │                    │
│                                         ▼                    │
│                                  ┌────────────────┐          │
│                                  │   SQLite DB    │          │
│                                  │  (Prisma)      │          │
│                                  └────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 2. Backend Architecture

### 2.1 Layered Architecture Pattern

```
┌─────────────────────────────────────────┐
│         HTTP Request/Response           │
├─────────────────────────────────────────┤
│         Routes Layer                    │
│  (/api/courses, /api/analytics, etc)   │
├─────────────────────────────────────────┤
│      Controllers Layer                  │
│  (courseController, analyticsController)│
├─────────────────────────────────────────┤
│      Services Layer                     │
│  (CourseService, AnalyticsService)      │
├─────────────────────────────────────────┤
│      Repositories Layer                 │
│  (CourseRepository, EnrollmentRepository)│
├─────────────────────────────────────────┤
│      Data Access Layer                  │
│  Prisma Client → SQLite Database        │
└─────────────────────────────────────────┘
```

### 2.2 Middleware Stack

```
Express App
    ↓
├─ Helmet (Security headers)
├─ CORS (Cross-origin)
├─ Compression (Response compression)
├─ Cookie Parser (Cookie parsing)
├─ Morgan Logger (Request logging)
├─ Body Parser (JSON parsing)
├─ Request Timeout (30s timeout)
├─ Routes
│  ├─ Auth Routes
│  │  ├─ Validation Middleware
│  │  └─ Controllers
│  ├─ Course Routes
│  │  ├─ Auth Middleware
│  │  ├─ Validation Middleware
│  │  └─ Controllers
│  └─ Analytics Routes
│     ├─ Auth Middleware
│     ├─ Authorization Middleware
│     └─ Controllers
│
└─ Error Handler (Final error middleware)
```

### 2.3 Authentication Flow

```
┌──────────────────────────────────────┐
│  User Login Request                  │
│  POST /api/auth/login                │
│  { email, password }                 │
└─────────────────┬────────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │ Validation Middleware│
        └─────────┬───────────┘
                  │
                  ▼
        ┌──────────────────────────┐
        │ AuthController.login()   │
        └─────────┬────────────────┘
                  │
                  ▼
        ┌──────────────────────────┐
        │ AuthService.login()      │
        │ - Find user by email     │
        │ - Verify password        │
        │ - Generate JWT tokens    │
        └─────────┬────────────────┘
                  │
                  ▼
        ┌──────────────────────────┐
        │ UserRepository.findByEmail
        │ (Prisma query)           │
        └─────────┬────────────────┘
                  │
                  ▼
        ┌──────────────────────────┐
        │ Database Response        │
        └─────────┬────────────────┘
                  │
                  ▼
        ┌──────────────────────────┐
        │ Password Verification    │
        │ bcrypt.compare()         │
        └─────────┬────────────────┘
                  │
                  ▼
        ┌──────────────────────────┐
        │ Generate Tokens          │
        │ - Access Token (7d)      │
        │ - Refresh Token (30d)    │
        └─────────┬────────────────┘
                  │
                  ▼
        ┌──────────────────────────┐
        │ Response with tokens     │
        │ Set secure cookie        │
        └──────────────────────────┘
```

### 2.4 Request Handling Pattern

```
Every Request → Route → Controller → Service → Repository → ORM → DB

Example: GET /api/analytics/dashboard

1. Router matches route to controller
2. Authentication middleware verifies JWT
3. Controller extracts user ID from request
4. Service handles business logic
   - Fetch enrollments
   - Calculate metrics
   - Process data
5. Repository executes queries
   - StudentProfile.findUnique()
   - Enrollment.findMany()
6. Prisma translates to SQL
7. SQLite executes queries
8. Results flow back through layers
9. Service transforms data
10. Controller sends response
```

### 2.5 Error Handling Strategy

```
Error Occurrence
    ↓
Specific Error Type?
    ├─ ValidationError → 400 Bad Request
    ├─ AuthenticationError → 401 Unauthorized
    ├─ AuthorizationError → 403 Forbidden
    ├─ NotFoundError → 404 Not Found
    ├─ ConflictError → 409 Conflict
    └─ ServerError → 500 Internal Server Error
    ↓
Error Handler Middleware
    ├─ Log error with context
    ├─ Sanitize error message
    └─ Send consistent JSON response
    ↓
Response Format:
{
  "success": false,
  "message": "User-friendly message",
  "errors": [{ "field": "email", "message": "Error detail" }],
  "statusCode": 400
}
```

## 3. Frontend Architecture

### 3.1 Component Hierarchy

```
App (Root)
├─ <QueryClientProvider> (React Query)
│  └─ <ThemeProvider> (Material-UI)
│     └─ <AuthProvider> (Context)
│        └─ <BrowserRouter> (React Router)
│           ├─ <Routes>
│           │  ├─ <Route path="/login">
│           │  │  └─ LoginPage
│           │  │     ├─ useForm (React Hook Form)
│           │  │     ├─ validate with loginSchema
│           │  │     └─ useAuth hook
│           │  │
│           │  ├─ <ProtectedRoute path="/dashboard">
│           │  │  └─ StudentDashboardPage
│           │  │     ├─ <MainLayout>
│           │  │     │  ├─ Navbar
│           │  │     │  └─ Sidebar
│           │  │     ├─ useGetDashboardSummary()
│           │  │     ├─ useGetDailyActivity()
│           │  │     └─ StatCard Components
│           │  │
│           │  └─ <ProtectedRoute path="/analytics">
│           │     └─ AnalyticsPage
│           │        ├─ <MainLayout>
│           │        └─ Chart Components
│           │
│           └─ NotFound / Redirect
```

### 3.2 Data Flow with React Query

```
Component Render
    ↓
useGetDashboardSummary()
    ├─ Check cache
    ├─ Cache hit → Return cached data
    └─ Cache miss → Fetch from API
        ↓
    Axios Request
        ├─ Add Authorization header
        ├─ API Call
        └─ Handle response/error
        ↓
    React Query caching
        ├─ Store in memory
        ├─ Mark as fresh
        └─ Set stale time
        ↓
    Component receives data
        ├─ Render with new data
        ├─ Background refetch?
        └─ Update stale data if needed
```

### 3.3 State Management Strategy

```
State Types:

1. Global State (Auth)
   └─ AuthContext
      ├─ user
      ├─ isLoading
      ├─ login()
      ├─ register()
      └─ logout()

2. Server State (Data)
   └─ React Query
      ├─ Dashboard data
      ├─ Courses list
      ├─ Analytics data
      └─ Auto caching/refetch

3. UI State (Forms)
   └─ React Hook Form + local state
      ├─ Form field values
      ├─ Form errors
      └─ Form submission state

4. Local Component State
   └─ useState
      ├─ UI toggles
      ├─ Modal states
      └─ Tab selections
```

### 3.4 API Request Interceptors

```
Request Interceptor:
┌─────────────────────────────────────┐
│ Axios Request                       │
├─────────────────────────────────────┤
│ 1. Get token from localStorage      │
│ 2. Add Authorization header         │
│ 3. Send request                     │
└─────────────────────────────────────┘

Response Interceptor:
┌─────────────────────────────────────┐
│ Axios Response                      │
├─────────────────────────────────────┤
│ If 401 Unauthorized:                │
│ 1. Clear localStorage               │
│ 2. Redirect to /login               │
│ 3. Return error                     │
│                                     │
│ Otherwise:                          │
│ 1. Return response                  │
└─────────────────────────────────────┘
```

## 4. Database Schema Design

### 4.1 Schema Relationships

```
┌──────────────┐
│ User         │
├──────────────┤
│ id (PK)      │
│ email (UQ)   │
│ password     │
│ firstName    │
│ lastName     │
│ role         │
└──────┬───────┘
       │
       ├─── 1:1 ──► StudentProfile
       │            ├─ totalStudyTime
       │            └─ currentStreak
       │
       ├─── 1:1 ──► MentorProfile
       │            └─ specialty
       │
       └─── 1:N ──► Activity
                    ├─ type
                    ├─ timestamp
                    └─ metadata

┌──────────────┐
│ Course       │
├──────────────┤
│ id (PK)      │
│ title        │
│ description  │
└──────┬───────┘
       │
       └─── 1:N ──► Section
                    ├─ title
                    └─ order
                        │
                        └─── 1:N ──► Lesson
                                     ├─ title
                                     ├─ duration
                                     └─ order

┌──────────────────┐
│ Enrollment       │
├──────────────────┤
│ id (PK)          │
│ studentId (FK)   │
│ courseId (FK)    │
│ status           │
│ completionPercent│
└──────┬───────────┘
       │
       └─── 1:N ──► LessonProgress
                    ├─ status
                    ├─ timeSpent
                    ├─ startedAt
                    └─ completedAt
```

### 4.2 Indexing Strategy

```
Indexes for Performance:

1. User table
   └─ UNIQUE INDEX on email (fast login lookup)

2. Activity table
   ├─ INDEX on userId (user's activity)
   └─ INDEX on timestamp (time-range queries)

3. Enrollment table
   ├─ UNIQUE INDEX on (studentId, courseId)
   └─ INDEX on status (filter by status)

4. LessonProgress table
   └─ UNIQUE INDEX on (enrollmentId, lessonId)

5. StudentRecommendation table
   └─ INDEX on priority (sorted results)
```

### 4.3 Data Integrity

```
Cascading Deletes:
┌─────────────────────────────────────┐
│ Delete User                         │
├─────────────────────────────────────┤
│ ON DELETE CASCADE:                  │
│ ├─ StudentProfile                   │
│ ├─ MentorProfile                    │
│ ├─ Enrollments (cascade)            │
│ │  └─ LessonProgress (cascade)      │
│ └─ Activities                       │
└─────────────────────────────────────┘

Referential Integrity:
─ Foreign keys on studentId, courseId, etc.
─ ON DELETE SET NULL for optional relations
─ ON DELETE CASCADE for dependent data
```

## 5. API Design Patterns

### 5.1 RESTful Naming Conventions

```
Resources:
/api/courses              ← Collections
/api/courses/:id         ← Individual resource
/api/courses/:id/enroll  ← Actions
/api/analytics/dashboard ← Complex queries

HTTP Methods:
GET    /api/courses              ← List
GET    /api/courses/:id          ← Retrieve
POST   /api/courses              ← Create
PUT    /api/courses/:id          ← Update
DELETE /api/courses/:id          ← Delete

Nested Resources:
POST   /api/courses/:courseId/enroll
GET    /api/courses/:courseId/sections
```

### 5.2 Response Format Standardization

```
Success Response:
{
  "success": true,
  "message": "Operation successful",
  "data": {
    "id": "uuid",
    "title": "Course Title",
    ...
  },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true
  }
}

Error Response:
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address",
      "value": "invalid"
    }
  ],
  "statusCode": 400
}
```

## 6. Security Architecture

### 6.1 Authentication & Authorization

```
Authentication (Verify Identity):
┌──────────────────────────────────────┐
│ Credentials                          │
├──────────────────────────────────────┤
│ Email + Password                     │
│ ↓                                    │
│ Validate format                      │
│ ↓                                    │
│ Find user in DB                      │
│ ↓                                    │
│ Compare passwords with bcrypt        │
│ ↓                                    │
│ Generate JWT token                   │
│ ↓                                    │
│ Return token to client               │
└──────────────────────────────────────┘

Authorization (Verify Permission):
┌──────────────────────────────────────┐
│ Request with JWT token               │
├──────────────────────────────────────┤
│ ↓                                    │
│ Extract token from header            │
│ ↓                                    │
│ Verify token signature               │
│ ↓                                    │
│ Check token expiry                   │
│ ↓                                    │
│ Extract user role from token         │
│ ↓                                    │
│ Verify user has required role        │
│ ↓                                    │
│ Allow/deny request                   │
└──────────────────────────────────────┘
```

### 6.2 Security Headers & Middleware

```
Security Measures:

1. Helmet.js
   ├─ CSP (Content Security Policy)
   ├─ HSTS (HTTP Strict Transport Security)
   ├─ X-Frame-Options
   └─ Various security headers

2. CORS
   ├─ Whitelist allowed origins
   ├─ Allow credentials
   └─ Restrict methods

3. Input Validation
   ├─ express-validator
   ├─ Zod schemas
   └─ Type checking

4. Password Security
   ├─ Minimum 6 characters
   ├─ bcrypt hashing (10 rounds)
   └─ Never store plaintext

5. Token Management
   ├─ Short-lived access tokens (7 days)
   ├─ HTTP-only cookies
   ├─ Secure flag for HTTPS
   └─ SameSite=strict
```

## 7. Scalability Considerations

### 7.1 Current Architecture (Phase 1)

```
Single Instance
├─ Express server (one process)
├─ SQLite database
├─ In-memory query cache (minimal)
└─ Synchronous request handling

Limits:
├─ ~100 concurrent users
├─ Query performance depends on DB
└─ No background jobs support
```

### 7.2 Production Scalability (Phase 2)

```
├─ Load Balancer (Nginx)
├─ Multiple Express instances
├─ PostgreSQL database
├─ Redis cache layer
├─ Queue service (Bull/BullMQ)
└─ Separate analytics service
```

### 7.3 Enterprise Scale (Phase 3)

```
├─ API Gateway
├─ Microservices
│  ├─ Auth Service
│  ├─ Course Service
│  ├─ Analytics Service
│  └─ Notification Service
├─ Event Bus (Kafka/RabbitMQ)
├─ Distributed Cache (Redis Cluster)
├─ Time-series DB (InfluxDB)
└─ Message Queue
```

## 8. Performance Optimization

### 8.1 Backend Optimization

```
Database:
├─ Connection pooling
├─ Query optimization
├─ Strategic indexing
├─ Data denormalization (Activity)
└─ Pagination for large datasets

Caching:
├─ Query result caching
├─ Dashboard summaries cache
└─ Redis for future scaling

Request:
├─ Response compression (gzip)
├─ Request size limits
└─ Efficient serialization
```

### 8.2 Frontend Optimization

```
Bundling:
├─ Code splitting via Vite
├─ Tree shaking
├─ Minification
└─ Dynamic imports

Caching:
├─ React Query automatic caching
├─ Background refetch strategy
├─ Stale-while-revalidate pattern
└─ Service workers (future)

Rendering:
├─ Component memoization
├─ Lazy loading charts
├─ Virtual scrolling (future)
└─ Image optimization
```

## 9. Testing Strategy

### 9.1 Backend Testing

```
Unit Tests:
├─ AuthService
├─ CourseService
├─ AnalyticsService
├─ RecommendationService
└─ Utility functions

Integration Tests:
├─ API endpoints
├─ Database operations
└─ Service interactions

Test Tools:
├─ Node.js assert/test
├─ Prisma test utilities
└─ Mock database
```

### 9.2 Frontend Testing (Future)

```
Component Tests:
├─ Page components
├─ UI components
├─ Form validation
└─ Error handling

Hook Tests:
├─ useAuth
├─ useAPI hooks
└─ Custom hooks

E2E Tests:
├─ Login flow
├─ Enrollment flow
├─ Dashboard interaction
└─ Data submission
```

## 10. Deployment Architecture

### 10.1 Development

```
Local Machine
├─ Node.js runtime
├─ Vite dev server
├─ Backend dev server
└─ SQLite database
```

### 10.2 Staging

```
Cloud VM (AWS EC2 / GCP Compute)
├─ Node.js runtime
├─ Express production build
├─ PostgreSQL database
├─ Redis cache
└─ SSL/TLS certificate
```

### 10.3 Production

```
                    ┌─────────────┐
                    │ CDN / Cache │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
          ┌─────────┤   DNS       │
          │         └─────────────┘
          │
          ▼
    ┌────────────┐
    │ LB (Nginx) │
    └────┬──┬─────┘
         │  │
    ┌────┘  └────┐
    │             │
    ▼             ▼
┌────────┐   ┌────────┐
│Instance│   │Instance│  (Auto-scaling)
│  1     │   │  2     │
└───┬────┘   └───┬────┘
    │             │
    └──────┬──────┘
           │
     ┌─────▼────────┐
     │ PostgreSQL   │
     │ (Primary DB) │
     └──────────────┘

     ┌──────────────┐
     │ Redis Cluster│
     │ (Cache)      │
     └──────────────┘

     ┌──────────────┐
     │ Monitoring   │
     │ & Logging    │
     └──────────────┘
```

## 11. Monitoring & Observability

### 11.1 Key Metrics

```
Backend:
├─ Request latency (p50, p95, p99)
├─ Error rates by endpoint
├─ Database query performance
├─ Cache hit ratio
└─ Memory/CPU usage

Frontend:
├─ Page load time (FCP, LCP)
├─ API response times
├─ User interactions
├─ Error tracking
└─ Performance budgets
```

### 11.2 Logging Strategy

```
Levels:
├─ ERROR: Critical issues
├─ WARN: Potential problems
├─ INFO: Business events
└─ DEBUG: Detailed diagnostics

Structured Logging:
{
  "timestamp": "2024-01-01T12:00:00Z",
  "level": "INFO",
  "service": "backend",
  "endpoint": "POST /api/auth/login",
  "userId": "uuid",
  "duration": "45ms",
  "statusCode": 200
}
```

## 12. Development Best Practices

### 12.1 Code Organization

- **Single Responsibility**: Each file/function has one purpose
- **DRY Principle**: Don't Repeat Yourself
- **SOLID Principles**: Applied throughout
- **Meaningful Names**: Clear function/variable names
- **Comments**: Only for complex logic
- **Error Handling**: Explicit and comprehensive

### 12.2 Git Workflow

```
main (production)
  ↑
  └─ staging (pre-production)
     ↑
     └─ develop (integration)
        ↑
        └─ feature/feature-name (feature development)
```

### 12.3 Code Review Checklist

```
□ Follows project conventions
□ No hardcoded values
□ Error handling present
□ Input validation
□ Tests included (backend)
□ Comments for complex logic
□ Performance considered
□ Security reviewed
□ No console.log in production
□ Backwards compatible
```

---

## Summary

This architecture provides:

✅ **Scalability**: Layered architecture with clear separation
✅ **Maintainability**: Clean code and SOLID principles
✅ **Performance**: Caching, indexing, optimization
✅ **Security**: Comprehensive authentication & authorization
✅ **Testability**: Isolated layers for unit testing
✅ **Developer Experience**: Clear patterns and conventions

The design supports current needs while allowing growth to enterprise-scale systems.
