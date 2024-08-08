'use client';

import { ApolloProvider } from "@apollo/client";
import client from "../app/lib/apolloClient";
import { AuthProvider } from '../context/AuthContext';
import { SnackbarProvider } from "@/components/Snackbar";
import { Box, Hidden, Grid } from '@mui/material';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoutes';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isLoginPage = pathname === '/login';

  if (!isClient) {
    return null;
  }

  return (
    <html lang="en" style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0 }}>
        <SnackbarProvider>
          <ApolloProvider client={client}>
            <AuthProvider>
              {isLoginPage ? (
                children
              ) : (
                <ProtectedRoute>
                  <Box sx={{ display: 'flex', height: '100%' }}>
                    <Hidden mdUp>
                      <Sidebar open={sidebarOpen} onClose={toggleSidebar} temporary />
                    </Hidden>
                    <Grid container sx={{ flexGrow: 1 }}>
                      <Hidden mdDown>
                        {sidebarOpen && <Grid item xs={2}>
                          <Sidebar open={sidebarOpen} onClose={toggleSidebar} />
                        </Grid>}
                      </Hidden>
                      <Grid item xs={12} md={sidebarOpen ? 10 : 12} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                        <Navbar onMenuClick={toggleSidebar} />
                        <Box component="main" sx={{ flexGrow: 1, p: 1, overflow: 'auto' }}>
                          {children}
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </ProtectedRoute>
              )}
            </AuthProvider>
          </ApolloProvider>
        </SnackbarProvider>
      </body>
    </html>
  );
}
