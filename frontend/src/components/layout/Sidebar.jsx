import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  Analytics as AnalyticsIcon,
  Lightbulb as LightbulbIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 250;

const studentMenuItems = [
  { title: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { title: 'Courses', path: '/courses', icon: SchoolIcon },
  { title: 'Analytics', path: '/analytics', icon: AnalyticsIcon },
  { title: 'Recommendations', path: '/recommendations', icon: LightbulbIcon },
];

const mentorMenuItems = [
  { title: 'Dashboard', path: '/mentor-dashboard', icon: DashboardIcon },
  { title: 'Students', path: '/students', icon: PeopleIcon },
  { title: 'Courses', path: '/courses', icon: SchoolIcon },
];

export const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = user?.role === 'MENTOR' ? mentorMenuItems : studentMenuItems;

  return (
    <Drawer
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          background: '#0f3460',
          color: '#fff',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ p: 2 }}>
        <List>
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    background: isActive ? '#16213e' : 'transparent',
                    borderLeft: isActive ? '4px solid #e94560' : 'none',
                    pl: isActive ? 1.75 : 2,
                  }}
                >
                  <ListItemIcon sx={{ color: '#fff' }}>
                    <IconComponent />
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};
