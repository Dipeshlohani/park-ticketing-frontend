'use client';
import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Grid, Table, TableBody, TableCell, TableHead, TableRow,
  Pagination, Chip, IconButton, Menu, MenuItem, Dialog, DialogActions, DialogContent, DialogTitle,
  tableCellClasses
} from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { styled } from '@mui/material/styles';
import { GET_ALL_USERS } from '@/graphql/queries';
import { UPDATE_USER, DELETE_USER, RESET_PASSWORD, UPDATE_STATUS } from '@/graphql/mutations';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#1976d2',
    color: theme.palette.common.white,
    fontSize: '0.7rem',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const roles = ['USER', 'ADMIN', 'STAFF', 'DIRECTOR'];

export default function UserManagementPage() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);
  const [resetPassword] = useMutation(RESET_PASSWORD);
  const [updateStatus] = useMutation(UPDATE_STATUS);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    role: '',
  });
  const [users, setUsers] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [errors, setErrors] = useState({});
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    if (data) {
      setUsers(data.getAllUsers);
    }
  }, [data]);

  const handleClick = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setFormState({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setDialogOpen(true);
    handleClose();
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmDelete(true);
    handleClose();
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteUser({
        variables: {
          id: deleteId,
        },
      });
      setUsers(users.filter(user => user._id !== deleteId));
      setConfirmDelete(false);
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDelete(false);
    setDeleteId(null);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setCurrentUser(null);
    setFormState({
      name: '',
      email: '',
      role: '',
    });
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formState.name) validationErrors.name = 'Name is required';
    if (!formState.email) validationErrors.email = 'Email is required';
    if (!formState.role) validationErrors.role = 'Role is required';
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    try {
      await updateUser({
        variables: {
          id: currentUser._id,
          input: formState,
        },
      });
      handleDialogClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBlockUser = async (id, status) => {
    status = status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
    console.log(id, status)
    try {
      await updateStatus({
        variables: {
          id,
          input: { status },
        },
      });
      setUsers(users.map(user => (user._id === id ? { ...user, status } : user)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetPassword = async (id) => {
    const newPassword = prompt("Enter new password:");
    if (newPassword) {
      try {
        await resetPassword({
          variables: {
            id,
            input: { newPassword },
          },
        });
        alert('Password reset successfully');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <Grid className="container mx-auto px-4 py-8">
      <Grid container alignItems="center" justifyContent="space-between" mb={3} mr={3}>
        <Grid item xs={4}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>User Management</Typography>
        </Grid>
        <Grid item xs={8}>
          <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
            <Grid item>
              <TextField
                className="max-w-xs"
                placeholder="Search users..."
                type="search"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" sx={{ p: 1.5 }} href='/users/add'>Add New User</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table size="small">
            <TableHead>
              <StyledTableRow hover role="checkbox" tabIndex={-1}>
                <StyledTableCell>S.N.</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <StyledTableRow key={user._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{user.name}</StyledTableCell>
                  <StyledTableCell>{user.email}</StyledTableCell>
                  <StyledTableCell>{user.role}</StyledTableCell>
                  <StyledTableCell>
                    <Chip label={user.status} color={user.status === 'ACTIVE' ? 'success' : 'error'} />
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton onClick={(event) => handleClick(event, user._id)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedUserId === user._id}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => handleEdit(user)}>Edit</MenuItem>
                      <MenuItem onClick={() => handleBlockUser(user._id, user.status)}>{user.status === 'BLOCKED' ? 'Unblock' : 'Block'}</MenuItem>
                      <MenuItem onClick={() => handleResetPassword(user._id)}>Reset Password</MenuItem>
                      <MenuItem onClick={() => handleDeleteClick(user._id)}>Delete</MenuItem>
                    </Menu>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Grid container justifyContent="center" className="bg-indigo-100 dark:bg-indigo-800 px-4 py-3" sx={{ mt: 2 }}>
          <Pagination count={3} color="primary" />
        </Grid>
      </div>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              backgroundColor: 'background.default',
            }}
          >
            <form noValidate autoComplete="off" onSubmit={handleSubmit}>
              <Box mb={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Name"
                  name="name"
                  required
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Enter Your Name"
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Box>
              <Box mb={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  required
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  error={!!errors.email}
                  helperText={errors.email}
                  multiline
                  rows={1}
                />
              </Box>
              <TextField
                fullWidth
                select
                required
                name="role"
                value={formState.role}
                onChange={handleChange}
                SelectProps={{
                  native: true,
                }}
                helperText={errors.role || 'Select Role'}
                error={!!errors.role}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </TextField>
              <Box display="flex" justifyContent="flex-end" mt={3}>
                <Button variant="contained" color="primary" type="submit">
                  Save Changes
                </Button>
              </Box>
            </form>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmDelete} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this user?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
