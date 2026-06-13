# Student Learning Analytics Platform - Frontend

A modern, responsive React 19 + Vite frontend for the Student Learning Analytics Platform with real-time dashboards, analytics visualizations, and adaptive learning recommendations.

## 🏗️ Architecture

### Component-Based Architecture

```
App (Router + QueryClient)
├── AuthContext (Global Auth State)
├── MainLayout (Navbar + Sidebar)
│   ├── Pages (Route-specific screens)
│   │   ├── Dashboard
│   │   ├── Courses
│   │   ├── Analytics
│   │   └── Recommendations
│   └── Components (Reusable UI)
│       ├── Layout
│       ├── Charts
│       └── Cards
└── API Services (Data Fetching)
    ├── Auth API
    ├── Courses API
    ├── Analytics API
    └── Recommendations API
```

**Why this architecture?**
- **Component Composition**: Small, focused, reusable components
- **Separation of Concerns**: Business logic in services/hooks
- **Single Source of Truth**: Context API for auth, React Query for server state
- **Type Safety**: Zod validation for runtime type checking
- **Performance**: Code splitting, lazy loading, query optimization

## 📁 Project Structure

```
frontend/
├── src/
│   ├── main.jsx              # Vite entry point
│   ├── App.jsx               # Router and layout
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── MainLayout.jsx
│   │   ├── ui/
│   │   │   └── Cards.jsx     # Stat cards, progress cards
│   │   ├── charts/
│   │   │   └── Charts.jsx    # Recharts components
│   │   └── common/           # Reusable UI components
│   ├── pages/                # Full page components
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── StudentDashboardPage.jsx
│   │   ├── MentorDashboardPage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   └── RecommendationsPage.jsx
│   ├── context/
│   │   └── AuthContext.jsx   # Auth state management
│   ├── hooks/
│   │   └── useAPI.js         # React Query hooks
│   ├── services/
│   │   └── api/
│   │       ├── client.js     # Axios configuration
│   │       └── endpoints.js  # API methods
│   ├── schemas/
│   │   └── index.js          # Zod validation schemas
│   ├── utils/
│   │   └── helpers.js        # Utility functions
│   ├── constants/
│   │   └── index.js          # App constants
│   ├── types/                # TypeScript types (if needed)
│   ├── styles/
│   │   └── globals.css       # Global styles
│   └── assets/               # Images, icons, etc.
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── README.md
```

## 🎨 Design System

**Color Palette:**
- Primary: `#0f3460` (Dark Blue)
- Secondary: `#e94560` (Coral Red)
- Background: `#f5f5f5` (Light Gray)
- Text: `#333` (Dark Gray)
- Accent: `#16213e` (Navy)

**Typography:**
- Font: Inter / System fonts
- Sizes: 12px, 14px, 16px, 18px, 20px, 24px, 32px, 40px

## 🔄 Data Flow

### React Query Integration

```javascript
// Queries (read data)
const { data, isLoading, error } = useGetDashboardSummary();

// Mutations (write data)
const enrollCourse = useEnrollCourse();
enrollCourse.mutateAsync(courseId);
```

**Why React Query?**
- Automatic caching
- Background refetching
- Stale state management
- Optimistic updates
- Infinite queries for pagination

### Authentication Flow

```
1. User visits /login
2. Submit email/password
3. AuthService calls login API
4. Token stored in localStorage
5. User redirected to dashboard
6. Axios interceptor adds token to requests
7. Protected routes verified via useAuth hook
```

## 🚀 Performance Optimizations

1. **Code Splitting**: React Router lazy loading
2. **Image Optimization**: SVG icons (lucide-react)
3. **Bundle Analysis**: Vite build reports
4. **API Caching**: React Query stale-while-revalidate
5. **Debouncing**: Search queries
6. **Memoization**: useMemo for expensive calculations
7. **Component Lazy Loading**: Charts and analytics

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend running on http://localhost:5000

### Installation

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env
# Edit .env if needed (default points to http://localhost:5000/api)
```

3. **Start dev server:**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📊 Component Examples

### Using React Query Hook
```javascript
const { data: summary, isLoading } = useGetDashboardSummary();

if (isLoading) return <Spinner />;
return <Dashboard data={summary} />;
```

### Form with Validation
```javascript
const { control, handleSubmit } = useForm({
  resolver: zodResolver(loginSchema),
});

<form onSubmit={handleSubmit(onSubmit)}>
  <Controller
    name="email"
    control={control}
    render={({ field, fieldState: { error } }) => (
      <TextField
        {...field}
        error={!!error}
        helperText={error?.message}
      />
    )}
  />
</form>
```

## 🎯 Key Design Decisions

### 1. React Query over Redux
**Why:** Simpler, less boilerplate, built for async data
**Alternative:** Redux, Zustand

### 2. Material-UI Components
**Why:** Production-ready, accessible, consistent
**Alternative:** ShadCN, Chakra UI

### 3. Zod Validation
**Why:** Runtime type safety, great error messages
**Alternative:** Yup, Joi

### 4. Context API for Auth
**Why:** Simple, sufficient for auth state
**Alternative:** Redux, Zustand

### 5. Recharts for Visualizations
**Why:** React-native, composable, lightweight
**Alternative:** Chart.js, D3.js

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints**: xs (0), sm (600px), md (960px), lg (1280px)
- **Sidebar**: Drawer on mobile, fixed on desktop
- **Tables**: Horizontal scroll on mobile
- **Charts**: Responsive containers

## 🔐 Security Best Practices

1. **Secure Token Storage**: localStorage (consider secure cookie for production)
2. **CORS**: Managed by backend
3. **Input Validation**: Zod schemas
4. **XSS Protection**: React auto-escapes
5. **CSRF Protection**: Built-in with token headers
6. **Sensitive Data**: Never expose in localStorage

## 🌐 API Integration

### Axios Configuration
```javascript
// Auto-adds Authorization header
// Auto-redirects 401 to login
// Supports credentials for cookies
```

### Error Handling
```javascript
try {
  const result = await authAPI.login(credentials);
} catch (error) {
  // error.response.data.message
  // error.response.status
}
```

## 🧪 Testing Strategy

**Components:**
- Render with React Testing Library
- Mock hooks with jest.mock

**Pages:**
- Test with mocked API responses

**Utilities:**
- Pure function tests with Jest

## 📈 Analytics Implementation

**Dashboard Metrics:**
- Total courses enrolled
- Lessons completed
- Current streak
- Average daily study time
- Completion percentage

**Charts:**
- 7-day activity (Area Chart)
- Weekly/monthly trends (Line Chart)
- Course completion (Bar Chart)
- Course distribution (Pie Chart)

## 🎓 Learning Path Features

1. **Adaptive Recommendations**: Based on progress and activity
2. **Progress Tracking**: Real-time lesson completion
3. **Streak Tracking**: Motivational daily engagement
4. **Performance Insights**: Time spent, completion rates
5. **Peer Comparison**: Mentor view of student metrics

## 🚀 Production Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Other Options
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Docker + container registry

### Environment Variables (Production)
```
VITE_API_URL=https://api.yourdomain.com
```

## 📊 Performance Targets

- **FCP** (First Contentful Paint): < 1.5s
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **Bundle Size**: < 200KB gzipped

## 🔗 API Communication

**Response Format:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ },
  "pagination": { "page": 1, "limit": 10, "total": 50 }
}
```

**Error Format:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [{ "field": "email", "message": "Invalid" }]
}
```

## 🎯 Future Enhancements

1. **Dark Mode**: Theme switcher with localStorage
2. **Notifications**: Real-time alerts for recommendations
3. **Mobile App**: React Native version
4. **Offline Support**: Service workers + IndexedDB
5. **Social Features**: Student comparison, leaderboards
6. **AI Integration**: Smarter recommendations with ML

## 📝 License

MIT
