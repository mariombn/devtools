import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import GenerateIcon from '@mui/icons-material/PersonAdd';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  path: string;
}

const menuItems: MenuItem[] = [
  { text: 'JSON Toolkit', icon: <CodeIcon />, path: '/json' },
  { text: 'Data Generator', icon: <GenerateIcon />, path: '/generator' },
  { text: 'Text Comparator', icon: <CompareArrowsIcon />, path: '/diff' },
];

interface SidebarProps {
  mobileOpen: boolean;
  desktopOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, desktopOpen, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const drawerContent = (
    <Box>
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { sm: desktopOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 } }}>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="persistent"
        open={desktopOpen}
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            transition: 'transform 0.3s ease, width 0.3s ease',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
