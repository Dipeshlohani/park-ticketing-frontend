'use client';
import { useQuery, useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import {
  Typography, Button, TextField, Grid, Table, TableHead, TableRow, TableCell, TableBody, Box, tableCellClasses,
  Pagination, Paper, IconButton, Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { GET_ALL_CATEGORIES } from '@/graphql/queries';
import { DELETE_CATEGORY, CREATE_CATEGORY, UPDATE_CATEGORY } from '@/graphql/mutations';
import { useSnackbar } from '@/components/Snackbar';
import { z } from 'zod';

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

const categorySchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  image: z.any().nullable(),
});

export default function CategoryManagementPage() {
  const { loading, error, data, refetch } = useQuery(GET_ALL_CATEGORIES);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const [editCategory, setEditCategory] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name);
      setDescription(editCategory.description);
      setImage(editCategory.image);
      setOpenEditDialog(true);
    }
  }, [editCategory]);

  const handleDelete = (id) => {
    deleteCategory({ variables: { id } })
      .then(() => {
        showSnackbar('Category deleted successfully', 'success');
        refetch();
      })
      .catch(() => {
        showSnackbar('Failed to delete category', 'error');
      });
  };

  const handleEdit = (category) => {
    setEditCategory(category);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditCategory(null);
    setName('');
    setDescription('');
    setImage(null);
    setErrors({});
  };

  const handleUpdateCategory = (event) => {
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

    updateCategory({ variables: { id: editCategory._id, category: categoryInput } })
      .then(() => {
        showSnackbar('Category updated successfully', 'success');
        handleCloseEditDialog();
        refetch();
      })
      .catch(() => {
        showSnackbar('Failed to update category', 'error');
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    return <p>Error :(</p>;
  }

  return (
    <Grid className="container mx-auto px-4 py-8">
      <Grid container alignItems="center" justifyContent="space-between" mb={3} mr={3}>
        <Grid item xs={4}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>Category Management</Typography>
        </Grid>
        <Grid item xs={8}>
          <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
            <Grid item>
              <TextField
                className="max-w-xs"
                placeholder="Search category..."
                type="search"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" sx={{ p: 1.5 }} href='/category/add'>Add New Category</Button>
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
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {data.categories.map((category, index) => (
                <StyledTableRow key={category._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{category.name}</StyledTableCell>
                  <StyledTableCell>{category.description}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<EditIcon />}
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(category)}
                    >
                      Edit
                    </Button>
                    <Button
                      color='error'
                      variant="contained"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Grid container justifyContent="center" className="bg-indigo-100 dark:bg-indigo-800 px-4 py-3" sx={{ mt: 2 }}>
          <Pagination count={Math.ceil(data.categories.length / 10)} color="primary" />
        </Grid>
      </div>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off" onSubmit={handleUpdateCategory}>
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
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateCategory} color="primary" variant="contained">
            Save Category
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
