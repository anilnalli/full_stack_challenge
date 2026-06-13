import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography, Alert, Chip } from '@mui/material';
import { MainLayout } from '../components/layout/MainLayout';
import { useGetCourseById, useGetMyEnrollments, useEnrollCourse } from '../hooks/useAPI';
import { formatTime } from '../utils/helpers';

export const CourseDetailPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading: courseLoading, error: courseError } = useGetCourseById(courseId);
  const { data: enrollmentsData, isLoading: enrollmentsLoading } = useGetMyEnrollments(1, 50);
  const enrollCourse = useEnrollCourse();

  const currentEnrollment = useMemo(
    () => enrollmentsData?.data?.find((enrollment) => enrollment.courseId === courseId) || null,
    [courseId, enrollmentsData]
  );

  const isEnrolled = Boolean(currentEnrollment);

  const lessonProgressMap = useMemo(() => {
    const map = new Map();
    currentEnrollment?.lessonProgress?.forEach((progress) => {
      map.set(progress.lessonId, progress);
    });
    return map;
  }, [currentEnrollment]);

  const allLessonsCount = course?.sections?.reduce((count, section) => count + (section.lessons?.length || 0), 0) || 0;
  const totalCourseMinutes = course?.sections?.reduce(
    (count, section) =>
      count + (section.lessons?.reduce((lessonSum, lesson) => lessonSum + (lesson.duration || 0), 0) || 0),
    0
  ) || 0;
  const completedCount = currentEnrollment?.lessonProgress?.filter((progress) => progress.status === 'COMPLETED').length || 0;
  const inProgressCount = currentEnrollment?.lessonProgress?.filter((progress) => progress.status === 'IN_PROGRESS').length || 0;
  const notStartedCount = allLessonsCount - completedCount - inProgressCount;

  const handleEnroll = async () => {
    try {
      await enrollCourse.mutateAsync(courseId);
    } catch (err) {
      console.error('Failed to enroll:', err);
    }
  };

  if (courseLoading || enrollmentsLoading) return <MainLayout isLoading />;

  if (courseError) {
    return (
      <MainLayout>
        <Alert severity="error">Unable to load course details.</Alert>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Button variant="outlined" sx={{ mb: 3 }} onClick={() => navigate(-1)}>
        Back
      </Button>

      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
        {course?.title}
      </Typography>

      <Typography color="textSecondary" sx={{ mb: 3 }}>
        {course?.description}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Enrollment
              </Typography>
              <Typography variant="h6" sx={{ mb: 1 }}>
                {isEnrolled ? 'Enrolled' : 'Not enrolled'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {allLessonsCount} lessons
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {completedCount} completed, {inProgressCount} in progress
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {notStartedCount} not started
              </Typography>
              {!isEnrolled && (
                <Button variant="contained" onClick={handleEnroll}>
                  Enroll in course
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={8}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Course Overview
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {course?.sections?.length || 0} sections
              </Typography>
              <Typography variant="body2">
                Total course duration: {formatTime(totalCourseMinutes)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
        Lessons
      </Typography>

      {course?.sections?.map((section) => (
        <Box key={section.id} sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {section.title}
          </Typography>
          <Grid container spacing={2}>
            {section.lessons?.map((lesson) => {
              const progress = lessonProgressMap.get(lesson.id);
              const status = progress?.status || (isEnrolled ? 'PENDING' : 'LOCKED');
              return (
                <Grid item xs={12} sm={6} key={lesson.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle1">{lesson.title}</Typography>
                        <Chip
                          label={status.replace('_', ' ')}
                          color={status === 'COMPLETED' ? 'success' : status === 'IN_PROGRESS' ? 'warning' : 'default'}
                          size="small"
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {lesson.description}
                      </Typography>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Duration: {formatTime(lesson.duration || 0)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}
    </MainLayout>
  );
};
