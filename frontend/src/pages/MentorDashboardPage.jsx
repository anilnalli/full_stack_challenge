import { Box, Grid, Typography, CircularProgress, Alert, Button } from '@mui/material';
import { StatCard } from '../components/ui/Cards';
import { useGetMentorDashboard } from '../hooks/useAPI';
import { MainLayout } from '../components/layout/MainLayout';
import { Users, TrendingUp, AlertTriangle, Award } from 'lucide-react';

export const MentorDashboardPage = () => {
  const { data: dashboard, isLoading, error } = useGetMentorDashboard();

  if (isLoading) return <MainLayout isLoading />;

  if (error) {
    return (
      <MainLayout>
        <Alert severity="error">Failed to load mentor dashboard</Alert>
      </MainLayout>
    );
  }

  if (!dashboard) {
    return (
      <MainLayout>
        <Alert severity="info">No students assigned yet</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        👨‍🏫 Mentor Dashboard
      </Typography>

      {/* Overview Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={dashboard.totalStudents}
            icon={Users}
            color="#0f3460"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Avg Completion"
            value={`${dashboard.averageCompletion}%`}
            icon={TrendingUp}
            color="#4caf50"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="At Risk"
            value={dashboard.studentsAtRisk}
            icon={AlertTriangle}
            color="#ff9800"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Top Performers"
            value={dashboard.topPerformers}
            icon={Award}
            color="#4caf50"
          />
        </Grid>
      </Grid>

      {/* Students List */}
      <Box sx={{ background: '#fff', borderRadius: 1, overflow: 'auto' }}>
        <Typography variant="h6" sx={{ p: 2, fontWeight: 'bold' }}>
          Student Performance
        </Typography>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ddd' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>Student ID</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Enrolled Courses</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Completed</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Average Completion</th>
            </tr>
          </thead>
          <tbody>
            {dashboard.studentMetrics?.map((student, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{student.studentId.substring(0, 8)}</td>
                <td style={{ padding: 12 }}>{student.enrolledCourses}</td>
                <td style={{ padding: 12 }}>{student.completedCourses}</td>
                <td style={{ padding: 12 }}>
                  <span style={{
                    background: student.averageCompletion >= 80 ? '#4caf50' : student.averageCompletion >= 50 ? '#ff9800' : '#f44336',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: 4,
                  }}>
                    {student.averageCompletion}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </MainLayout>
  );
};
