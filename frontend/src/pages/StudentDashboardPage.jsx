import { Box, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { StatCard, ProgressCard } from '../components/ui/Cards';
import { LineChartComponent, AreaChartComponent } from '../components/charts/Charts';
import { useGetDashboardSummary, useGetDailyActivity } from '../hooks/useAPI';
import { School, TrendingUp, Flame, Clock } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';

export const StudentDashboardPage = () => {
  const { data: summary, isLoading: summaryLoading, error: summaryError } = useGetDashboardSummary();
  const { data: dailyActivity, isLoading: activityLoading } = useGetDailyActivity(7);

  if (summaryLoading) return <MainLayout isLoading />;

  if (summaryError) {
    return (
      <MainLayout>
        <Alert severity="error">Failed to load dashboard</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        📊 Your Learning Dashboard
      </Typography>

      {/* KPI Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Courses"
            value={summary?.totalCourses || 0}
            icon={School}
            color="#0f3460"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Lessons Completed"
            value={summary?.completedLessons || 0}
            icon={TrendingUp}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Current Streak"
            value={`${summary?.currentStreak || 0} days`}
            icon={Flame}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Daily Study"
            value={`${Math.round(summary?.averageDailyStudyTime || 0)} min`}
            icon={Clock}
            color="#e94560"
          />
        </Grid>
      </Grid>

      {/* Progress Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <ProgressCard
            title="Courses Progress"
            value={Math.round((summary?.completedLessons || 0) / Math.max(summary?.totalLessons || 1, 1) * summary?.totalCourses)}
            total={summary?.totalCourses || 1}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ProgressCard
            title="Lesson Completion"
            value={summary?.completedLessons || 0}
            total={summary?.totalLessons || 0}
            status={summary?.completionPercent < 50 ? 'warning' : 'normal'}
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {dailyActivity && !activityLoading ? (
            <AreaChartComponent
              title="7-Day Learning Activity"
              data={dailyActivity}
              dataKey="value"
            />
          ) : (
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          )}
        </Grid>
      </Grid>
    </MainLayout>
  );
};
