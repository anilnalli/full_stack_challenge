import { Box, Typography, Alert, CircularProgress, Button } from '@mui/material';
import { useGetNextRecommendedLesson, useGenerateRecommendations } from '../hooks/useAPI';
import { MainLayout } from '../components/layout/MainLayout';
import { Lightbulb } from 'lucide-react';

export const RecommendationsPage = () => {
  const { data: nextLesson, isLoading: lessonLoading } = useGetNextRecommendedLesson();
  const generateRecommendations = useGenerateRecommendations();

  const handleGenerate = async () => {
    try {
      await generateRecommendations.mutateAsync();
    } catch (err) {
      console.error('Failed to generate recommendations:', err);
    }
  };

  if (lessonLoading) return <MainLayout isLoading />;

  return (
    <MainLayout>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        💡 Recommended Learning Path
      </Typography>

      <Box sx={{
        background: '#fff',
        p: 3,
        borderRadius: 1,
        border: '2px solid #0f3460',
      }}>
        {nextLesson ? (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Lightbulb style={{ fontSize: 32, color: '#0f3460' }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {nextLesson.lesson?.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {nextLesson.lesson?.section?.course?.title}
                </Typography>
              </Box>
            </Box>

            {nextLesson.lesson?.description && (
              <Typography variant="body2" sx={{ mb: 2 }}>
                {nextLesson.lesson.description}
              </Typography>
            )}

            <Typography variant="body2" color="textSecondary">
              Duration: {nextLesson.lesson?.duration} minutes
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Reason: {nextLesson.reason.replace(/_/g, ' ').toLowerCase()}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 2, background: '#0f3460' }}
            >
              Start Learning
            </Button>
          </Box>
        ) : (
          <Alert severity="info">
            No recommendations yet. Generate personalized recommendations based on your progress.
          </Alert>
        )}
      </Box>

      <Button
        onClick={handleGenerate}
        variant="contained"
        sx={{ mt: 2, background: '#e94560' }}
        disabled={generateRecommendations.isLoading}
      >
        {generateRecommendations.isLoading ? 'Generating...' : 'Generate Recommendations'}
      </Button>
    </MainLayout>
  );
};
