import React from 'react';
import {
  Link as MuiLink,
  Grid,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Search as SearchIcon,
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
  LayoutGrid as LayoutGridIcon,
  Package as PackageIcon,
  PackageTwo as Package2Icon,
  Users as UsersIcon,
  CalendarToday as CalendarIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';

export default function Dashboard() {
  return (
    <Grid container className="min-h-screen" spacing={2}>
      <Grid item xs={12} lg={3}>
        <Box
          borderRight="1px solid"
          borderColor="divider"
          bgcolor="background.paper"
          p={2}
          display={{ xs: 'none', lg: 'block' }}
        >
          <Box
            display="flex"
            alignItems="center"
            borderBottom="1px solid"
            borderColor="divider"
            p={2}
          >
            <MuiLink href="#" underline="none" color="text.primary">
              {/* <Package2Icon sx={{ mr: 1 }} /> */}
              <Typography variant="h6" component="span">
                Admin Dashboard
              </Typography>
            </MuiLink>
          </Box>
          <Box overflow="auto" flex={1} py={2}>
            <Box component="nav" sx={{ '& > *': { mb: 1 } }}>
              <MuiLink
                href="#"
                underline="none"
                color="text.primary"
                variant="body1"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  borderRadius: 1,
                  p: 1,
                  transition: 'color 0.3s',
                  '&:hover': { color: 'text.secondary' },
                }}
              >
                <HomeIcon />
                Home
              </MuiLink>
              {/* Other links */}
            </Box>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12} lg={9}>
        <AppBar position="static" elevation={0} color="transparent">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 1 }}
              size="large"
            >
              {/* <Package2Icon /> */}
            </IconButton>
            <Box sx={{ display: 'flex', flex: 1 }}>
              <Box sx={{ position: 'relative', width: '100%' }}>
                <SearchIcon
                  sx={{
                    position: 'absolute',
                    left: 2,
                    top: 2,
                    color: 'text.disabled',
                  }}
                />
                <InputBase
                  sx={{
                    pl: 8,
                    pr: 1,
                    width: '100%',
                    bgcolor: 'background.paper',
                  }}
                  placeholder="Search..."
                  inputProps={{ 'aria-label': 'search' }}
                />
              </Box>
            </Box>
            <Menu
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              getContentAnchorEl={null}
              anchorEl={null}
              open={false}
            >
              <MenuItem>Settings</MenuItem>
              <MenuItem>Support</MenuItem>
              <MenuItem>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Box p={4}>
          <Typography variant="h5" sx={{ mb: 4 }}>
            Dashboard
          </Typography>
          <Grid container spacing={2}>
            {/* Cards */}
          </Grid>
          <Box sx={{ mt: 4 }}>
            <Card>
              <CardHeader title="User List" />
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>{/* Table rows */}</TableBody>
                </Table>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}
