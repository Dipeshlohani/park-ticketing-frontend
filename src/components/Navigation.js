import React from 'react';
import Link from 'next/link';
import { List, ListItem, ListItemText } from '@mui/material';

const Navigation = () => {
  return (
    <div>
      <List>
        <Link href="/" passHref>
          <ListItem button component="a">
            <ListItemText primary="Home" />
          </ListItem>
        </Link>
        <Link href="/categories" passHref>
          <ListItem button component="a">
            <ListItemText primary="Categories" />
          </ListItem>
        </Link>
        <Link href="/subcategories" passHref>
          <ListItem button component="a">
            <ListItemText primary="Subcategories" />
          </ListItem>
        </Link>
        <Link href="/users" passHref>
          <ListItem button component="a">
            <ListItemText primary="Users" />
          </ListItem>
        </Link>
        <Link href="/bookings" passHref>
          <ListItem button component="a">
            <ListItemText primary="Bookings" />
          </ListItem>
        </Link>
        <Link href="/logout" passHref>
          <ListItem button component="a">
            <ListItemText primary="Logout" />
          </ListItem>
        </Link>
      </List>
    </div>
  );
};

export default Navigation;
