'use client';
import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, IconButton } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useMutation } from '@apollo/client';
import { CREATE_CATEGORY } from '@/graphql/mutations';
import { useSnackbar } from '@/components/Snackbar';
import { z } from 'zod';

const categorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  image: z.any().nullable(),
});

export default function AddCategoryPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [createCategory] = useMutation(CREATE_CATEGORY);
  const { showSnackbar } = useSnackbar();

  const handleSubmit = (event) => {
    event.preventDefault();

    const categoryInput = { name, description, image };
    const validationResult = categorySchema.safeParse(categoryInput);

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.reduce((acc, error) => {
        acc[error.path[0]] = error.message;
        return acc;
      }, {});
      setErrors(errorMessages);
      return;
    }

    createCategory({ variables: { category: categoryInput } })
      .then(() => {
        showSnackbar('Category added successfully', 'success');
        setName('');
        setDescription('');
        setImage(null);
        setErrors({});
      })
      .catch(() => {
        showSnackbar('Failed to add category', 'error');
      });
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
          Add New Category
        </Typography>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Box mb={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Name"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Box>
          <Box mb={3}>
            <Typography variant="body1" component="label" htmlFor="image-upload" gutterBottom>
              Image
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              border="2px dashed"
              borderRadius="10px"
              borderColor="grey.500"
              height="150px"
              sx={{
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                },
              }}
              component="label"
              htmlFor="image-upload"
            >
              <IconButton color="primary" aria-label="upload picture" component="span">
                <UploadFileIcon sx={{ fontSize: 40 }} />
              </IconButton>
              <Typography variant="body2" color="textSecondary">
                Click to upload or drag and drop
              </Typography>
              <Typography variant="caption" color="textSecondary">
                SVG, PNG, JPG or GIF (MAX. 800x400px)
              </Typography>
              <input
                accept="image/*"
                id="image-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Box>
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Description"
              placeholder="Enter category description"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" type="submit">
              Save Category
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
