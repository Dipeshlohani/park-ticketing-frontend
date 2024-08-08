'use client';
import { Typography, Button, TextField, Grid, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, Pagination, Box, tableCellClasses, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { PaginationItem, PaginationLink, PaginationPrevious, PaginationNext } from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { GET_ALL_SUBCATEGORIES, GET_ALL_CATEGORIES } from '@/graphql/queries';
import { DELETE_SUBCATEGORY, UPDATE_SUBCATEGORY } from '@/graphql/mutations';
import { useMutation, useQuery } from '@apollo/client';
import { useSnackbar } from '@/components/Snackbar';
import { useState, useEffect } from 'react';

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

export default function SubcategoryListPage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_SUBCATEGORIES);
  const { data: categoryData } = useQuery(GET_ALL_CATEGORIES);
  const [deleteSubcategory] = useMutation(DELETE_SUBCATEGORY);
  const [updateSubcategory] = useMutation(UPDATE_SUBCATEGORY);
  const { showSnackbar } = useSnackbar();

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentSubcategory, setCurrentSubcategory] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [pawanmedia, setPawanmedia] = useState('');
  const [nagarpalikaTax, setNagarpalikaTax] = useState('');
  const [park, setPark] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (currentSubcategory) {
      setName(currentSubcategory.name);
      setPrice(currentSubcategory.price);
      setPawanmedia(currentSubcategory.pawanmedia);
      setNagarpalikaTax(currentSubcategory.nagarpalika_tax);
      setPark(currentSubcategory.park);
      setCategory(currentSubcategory.category._id);
      setOpenEditDialog(true);
    }
  }, [currentSubcategory]);

  const handleEdit = (subcategory) => {
    setCurrentSubcategory(subcategory);
  };

  const handleDelete = (id) => {
    deleteSubcategory({ variables: { id } })
      .then(() => {
        showSnackbar('Subcategory deleted successfully', 'success');
        refetch();
      })
      .catch(() => {
        showSnackbar('Failed to delete subcategory', 'error');
      });
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentSubcategory(null);
    setName('');
    setPrice('');
    setPawanmedia('');
    setNagarpalikaTax('');
    setPark('');
    setCategory('');
  };

  const handleUpdateSubcategory = (event) => {
    event.preventDefault();
    updateSubcategory({
      variables: {
        id: currentSubcategory._id,
        subcategory: {
          name,
          price,
          pawanmedia,
          nagarpalika_tax: nagarpalikaTax,
          park,
          category,
        },
      },
    })
      .then(() => {
        showSnackbar('Subcategory updated successfully', 'success');
        handleCloseEditDialog();
        refetch();
      })
      .catch(() => {
        showSnackbar('Failed to update subcategory', 'error');
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading subcategories</p>;

  return (
    <Grid className="container mx-auto px-4 py-8">
      <Grid container alignItems="center" justifyContent="space-between" mb={3} mr={3}>
        <Grid item xs={4}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>Sub Category Management</Typography>
        </Grid>
        <Grid item xs={8}>
          <Grid container spacing={2} alignItems="center" justifyContent="flex-end">
            <Grid item>
              <TextField
                className="max-w-xs"
                placeholder="Search subcategory..."
                type="search"
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" sx={{ p: 1.5 }} href='/subcategory/add'>Add New SubCategory</Button>
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
                <StyledTableCell>Price</StyledTableCell>
                <StyledTableCell>Pawan Media</StyledTableCell>
                <StyledTableCell>Nagarpalika Tax</StyledTableCell>
                <StyledTableCell>Park Revenue</StyledTableCell>
                <StyledTableCell>Category</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {data.subcategories.map((subcategory, index) => (
                <StyledTableRow key={subcategory._id}>
                  <StyledTableCell>{index + 1}</StyledTableCell>
                  <StyledTableCell>{subcategory.name}</StyledTableCell>
                  <StyledTableCell>{subcategory.price}</StyledTableCell>
                  <StyledTableCell>{subcategory.pawanmedia}</StyledTableCell>
                  <StyledTableCell>{subcategory.nagarpalika_tax}</StyledTableCell>
                  <StyledTableCell>{subcategory.park}</StyledTableCell>
                  <StyledTableCell>{subcategory.category.name}</StyledTableCell>
                  <StyledTableCell>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<EditIcon />}
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(subcategory)}
                    >
                      Edit
                    </Button>
                    <Button
                      color='error'
                      variant="contained"
                      size="small"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(subcategory._id)}
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
          <Pagination count={3} color="primary">

          </Pagination>
        </Grid>
      </div>

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Subcategory</DialogTitle>
        <DialogContent>
          <form noValidate autoComplete="off" onSubmit={handleUpdateSubcategory}>
            <Box mb={3}>
              <TextField
                fullWidth
                variant="outlined"
                label="Name"
                placeholder="Enter subcategory name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                variant="outlined"
                label="Price"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                variant="outlined"
                label="Pawan Media"
                placeholder="Enter Pawan Media"
                value={pawanmedia}
                onChange={(e) => setPawanmedia(e.target.value)}
              />
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                variant="outlined"
                label="Nagarpalika Tax"
                placeholder="Enter Nagarpalika Tax"
                value={nagarpalikaTax}
                onChange={(e) => setNagarpalikaTax(e.target.value)}
              />
            </Box>
            <Box mb={3}>
              <TextField
                fullWidth
                variant="outlined"
                label="Park Revenue"
                placeholder="Enter Park Revenue"
                value={park}
                onChange={(e) => setPark(e.target.value)}
              />
            </Box>
            <Box mb={3}>
              <Select
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Category
                </MenuItem>
                {categoryData && categoryData.categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <DialogActions>
              <Button onClick={handleCloseEditDialog} color="primary">Cancel</Button>
              <Button type="submit" variant="contained" color="primary">Save</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Grid>
  );
}
