import { useState } from 'react';
import type { ReactNode } from 'react';
import { Box, Toolbar } from '@mui/material';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

export function MainLayout({ children, title }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDesktopDrawerToggle = () => {
    setDesktopOpen(!desktopOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar 
        title={title} 
        onMenuClick={handleDrawerToggle}
        onDesktopMenuClick={handleDesktopDrawerToggle}
        desktopOpen={desktopOpen}
      />
      <Sidebar 
        mobileOpen={mobileOpen} 
        desktopOpen={desktopOpen}
        onClose={handleDrawerToggle} 
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: desktopOpen ? `calc(100% - 240px)` : '100%' },
          transition: 'width 0.3s ease',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
