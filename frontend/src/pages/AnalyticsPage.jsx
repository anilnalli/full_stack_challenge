import { Box, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { LineChartComponent, BarChartComponent, PieChartComponent } from '../components/charts/Charts';
import { useGetProgressByCourse, useGetWeeklyActivity, useGetMonthlyActivity } from '../hooks/useAPI';
import { MainLayout } from '../components/layout/MainLayout';

export const AnalyticsPage = () => {
  const { data: progressData, isLoading: progressLoading } = useGetProgressByCourse();
  const { data: weeklyData, isLoading: weeklyLoading } = useGetWeeklyActivity();
  const { data: monthlyData, isLoading: monthlyLoading } = useGetMonthlyActivity();

  if (progressLoading || weeklyLoading || monthlyLoading) {
    return <MainLayout isLoading />;
  }

  // Prepare data for charts
  const progressChartData = progressData?.data?.map((p) => ({
    name: p.courseTitle.substring(0, 15),
    value: p.completionPercent,
  })) || [];

  const actualProgressStatusCounts = [
    { name: 'Completed', value: progressData?.data?.filter((p) => p.status === 'COMPLETED').length || 0 },
    { name: 'In Progress', value: progressData?.data?.filter((p) => p.status === 'IN_PROGRESS').length || 0 },
    { name: 'Pending', value: progressData?.data?.filter((p) => p.status !== 'COMPLETED' && p.status !== 'IN_PROGRESS').length || 0 },
  ];

  const hasStatusData = actualProgressStatusCounts.some((item) => item.value > 0);
  const progressStatusCounts = hasStatusData
    ? actualProgressStatusCounts
    : [
        { name: 'Completed', value: 3 },
        { name: 'In Progress', value: 2 },
        { name: 'Pending', value: 1 },
      ];

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        📈 Analytics
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {weeklyData && (
            <LineChartComponent
              title="Weekly Learning Activity"
              data={weeklyData}
              dataKey="value"
            />
          )}
        </Grid>

        <Grid item xs={12}>
          {monthlyData && (
            <LineChartComponent
              title="Monthly Learning Activity"
              data={monthlyData}
              dataKey="value"
            />
          )}
        </Grid>

        <Grid item xs={12} md={6}>
          <PieChartComponent
            title="Course Status Distribution"
            data={progressStatusCounts}
            dataKey="value"
            nameKey="name"
          />
          {!hasStatusData && (
            <Box sx={{ mt: 2, color: 'text.secondary' }}>
              Showing sample distribution while course progress loads or when no enrollments are available.
            </Box>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          {progressChartData.length > 0 && (
            <BarChartComponent
              title="Course Completion Rates"
              data={progressChartData}
              dataKey="value"
              xAxisKey="name"
            />
          )}
        </Grid>
      </Grid>
    </MainLayout>
  );
};
