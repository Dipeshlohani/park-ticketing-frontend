'use client';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '@/graphql/mutations';
import { useSnackbar } from '@/components/Snackbar';

const roles = ['USER', 'ADMIN', 'STAFF', 'DIRECTOR'];

export default function UserForm() {
  const { showSnackbar } = useSnackbar();

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [errors, setErrors] = useState({});


  const [createUser, { loading }] = useMutation(CREATE_USER, {
    onError: (error) => {
      const validationErrors = {};
      error.graphQLErrors.forEach(({ extensions }) => {
        if (extensions.exception.response) {
          const messages = extensions.exception.response.message;
          messages.forEach((message) => {
            if (message.includes('Name')) validationErrors.name = message;
            if (message.includes('email')) validationErrors.email = message;
            if (message.includes('Password')) validationErrors.password = message;
            if (message.includes('Role')) validationErrors.role = message;
          });
        }
      });
      setErrors(validationErrors);
    },
  });

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
    if (!formState.password) validationErrors.password = 'Password is required';
    if (!formState.role) validationErrors.role = 'Role is required';
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrors({});
    if (!validateForm()) return;
    try {
      await createUser({ variables: { input: formState } });
      showSnackbar('User added successfully', 'success');
      setFormState({ name: '', email: '', password: '', role: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Add New User
        </Typography>
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
          <Box mb={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              name="password"
              type="password"
              required
              value={formState.password}
              onChange={handleChange}
              placeholder="Enter Password"
              error={!!errors.password}
              helperText={errors.password}
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
            <Button variant="contained" color="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save User'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
