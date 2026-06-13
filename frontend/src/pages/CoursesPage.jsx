import { Box, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { CourseCard } from '../components/ui/Cards';
import { useGetAllCourses, useEnrollCourse, useGetMyEnrollments } from '../hooks/useAPI';
import { MainLayout } from '../components/layout/MainLayout';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CoursesPage = () => {
  const [tab, setTab] = useState('available');
  const navigate = useNavigate();
  const { data: allCoursesData, isLoading: coursesLoading } = useGetAllCourses(1, 12);
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useGetMyEnrollments(1, 12);
  const enrollCourse = useEnrollCourse();

  const handleEnroll = async (courseId) => {
    try {
      await enrollCourse.mutateAsync(courseId);
      setTab('enrolled');
    } catch (err) {
      console.error('Enrollment failed:', err);
    }
  };

  const enrolledCourseIds = new Set(enrollmentsData?.data?.map(e => e.courseId));

  if (coursesLoading || enrollmentsLoading) return <MainLayout isLoading />;

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        📚 Courses
      </Typography>

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <button
          onClick={() => setTab('available')}
          style={{
            padding: '8px 16px',
            background: tab === 'available' ? '#0f3460' : '#ddd',
            color: tab === 'available' ? '#fff' : '#000',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Available ({allCoursesData?.data?.length || 0})
        </button>
        <button
          onClick={() => setTab('enrolled')}
          style={{
            padding: '8px 16px',
            background: tab === 'enrolled' ? '#0f3460' : '#ddd',
            color: tab === 'enrolled' ? '#fff' : '#000',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Enrolled ({enrollmentsData?.data?.length || 0})
        </button>
      </Box>

      <Grid container spacing={2}>
        {tab === 'available' && allCoursesData?.data?.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <CourseCard
              course={course}
              onEnroll={() => handleEnroll(course.id)}
              onView={() => navigate(`/courses/${course.id}`)}
              isEnrolled={enrolledCourseIds.has(course.id)}
            />
          </Grid>
        ))}

        {tab === 'enrolled' && enrollmentsData?.data?.map((enrollment) => (
          <Grid item xs={12} sm={6} md={4} key={enrollment.id}>
            <CourseCard
              course={enrollment.course}
              onView={() => navigate(`/courses/${enrollment.course.id}`)}
              isEnrolled={true}
            />
          </Grid>
        ))}
      </Grid>
    </MainLayout>
  );
};
