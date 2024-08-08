'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Collapse,
  Avatar,
} from '@mui/material';
import {
  Category as CategoryIcon,
  People as PeopleIcon,
  ChevronRight as ChevronRightIcon,
  Home as HomeIcon,
  ExpandMore as ChevronDownIcon,
  Layers as LayersIcon,
  CalendarToday as CalendarIcon,
  ExitToApp as LogOutIcon,
  Assessment,
} from '@mui/icons-material';
import { useAuth } from '@/context/AuthContext';

const Sidebar = ({ open, onClose, temporary }) => {
  const [openCategory, setOpenCategory] = useState(false);
  const { logout } = useAuth();

  const handleCategoryClick = () => {
    setOpenCategory(!openCategory);
  };

  return (
    <Drawer
      variant={temporary ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }} // Better open performance on mobile.
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: 240,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', padding: 12 }}>
          <Avatar src="/logo.png" alt="Logo" />
          <Typography variant="h6" style={{ marginLeft: 10 }}>
            Tribhuwan Park
          </Typography>
        </div>
        <Divider />
        <List style={{ flexGrow: 1 }}>
          <ListItem button component={Link} href="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem button onClick={handleCategoryClick}>
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Category" />
            {openCategory ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </ListItem>
          <Collapse in={openCategory} timeout="auto" unmountOnExit>
            <Divider sx={{ my: 1 }} />
            <List component="div" disablePadding sx={{ m: 1 }}>
              <ListItem button component={Link} href="/category/add">
                <ListItemText primary="Add Category" />
              </ListItem>
              <ListItem button component={Link} href="/category/view">
                <ListItemText primary="Show Category" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button component={Link} href="/subcategory/view">
            <ListItemIcon>
              <LayersIcon />
            </ListItemIcon>
            <ListItemText primary="Subcategory" />
          </ListItem>
          <ListItem button component={Link} href="/users/view">
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem button component={Link} href="/booking/view">
            <ListItemIcon>
              <CalendarIcon />
            </ListItemIcon>
            <ListItemText primary="Booking" />
          </ListItem>
          <ListItem button component={Link} href="/report">
            <ListItemIcon>
              <Assessment />
            </ListItemIcon>
            <ListItemText primary="Report" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button onClick={logout}>
            <ListItemIcon>
              <LogOutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
