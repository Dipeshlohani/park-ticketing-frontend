'use client';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box } from '@mui/material';
import Navbar from '@/components/Navbar';

import { useAuth } from '../../context/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box>
      <IconButton
        onClick={toggleSidebar}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          zIndex: 1000,
        }}
      >
        <MenuIcon />
      </IconButton>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={sidebarOpen ? 2 : 1}>
          <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
        </Grid>
        <Grid item xs={12} sm={sidebarOpen ? 10 : 11} p={2}>
          <Navbar onMenuClick={toggleSidebar} />
          <Dashboard />
        </Grid>
      </Grid>
    </Box>
  );
}
