import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import { formatPercentage, formatTime } from '../../utils/helpers';

export const StatCard = ({ title, value, icon: Icon, color = '#0f3460' }) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {value}
            </Typography>
          </Box>
          {Icon && <Icon sx={{ fontSize: 40, color }} />}
        </Box>
      </CardContent>
    </Card>
  );
};

export const ProgressCard = ({ title, value, total, status = 'normal' }) => {
  const percentage = (value / total) * 100;
  const statusColor = status === 'warning' ? '#ff9800' : '#4caf50';

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {value} / {total}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={percentage}
          sx={{ mb: 1, height: 8, borderRadius: 4 }}
        />
        <Typography variant="body2" color="textSecondary">
          {formatPercentage(percentage)} complete
        </Typography>
      </CardContent>
    </Card>
  );
};

export const CourseCard = ({ course, onEnroll, onView, isEnrolled = false }) => {
  return (
    <Card sx={{ transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {course.title}
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 2 }}>
          {course.description}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2">
            {course.sections?.length || 0} sections
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {onView && (
              <button
                onClick={onView}
                style={{
                  padding: '6px 12px',
                  background: '#e94560',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                View
              </button>
            )}
            {!isEnrolled && onEnroll && (
              <button
                onClick={onEnroll}
                style={{
                  padding: '6px 12px',
                  background: '#0f3460',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Enroll
              </button>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
