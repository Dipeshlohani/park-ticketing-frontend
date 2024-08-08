// AddSubcategoryPage.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, Typography, Paper, MenuItem } from '@mui/material';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_CATEGORIES } from '@/graphql/queries';
import { CREATE_SUBCATEGORY } from '@/graphql/mutations';
import { useSnackbar } from '@/components/Snackbar';

export default function AddSubcategoryPage() {
  const { data, loading, error } = useQuery(GET_ALL_CATEGORIES);
  const [createSubcategory] = useMutation(CREATE_SUBCATEGORY);
  const { showSnackbar } = useSnackbar();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [pawanmedia, setPawanMedia] = useState('');
  const [nagarpalika_tax, setNagarpalikaTax] = useState('');
  const [park, setParkRevenue] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (price && pawanmedia && nagarpalika_tax) {
      let pr = price - pawanmedia - nagarpalika_tax
      setParkRevenue(pr.toString());
    }
  }, [price, pawanmedia, nagarpalika_tax])


  const handleSubmit = (event) => {
    event.preventDefault();
    const subcategoryInput = { name, price, pawanmedia, nagarpalika_tax, park, category };
    createSubcategory({ variables: { subcategory: subcategoryInput } })
      .then(() => {
        showSnackbar('Subcategory added successfully', 'success');
        setName('');
        setPrice('');
        setPawanMedia('');
        setNagarpalikaTax('');
        setParkRevenue('');
        setCategory('');
      })
      .catch(() => {
        showSnackbar('Failed to add subcategory', 'error');
      });
  };

  useEffect(() => {
    if (data && data.categories.length > 0) {
      setCategory(data.categories[0]._id); // Set default category
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading categories</p>;


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
          Add New Sub Category
        </Typography>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Box mb={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Name"
              placeholder="Enter Subcategory Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Price"
              placeholder="Enter Price"
              value={price}
              type='number'
              onChange={(e) => setPrice(e.target.value)}
            />
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Pawan Media"
              placeholder="Enter Pawan Media Revenue"
              value={pawanmedia}
              type='number'

              onChange={(e) => setPawanMedia(e.target.value)}
            />
          </Box>
          <Box mb={3}>
            <TextField
              fullWidth
              variant="outlined"
              label="Nagarpalika Tax"
              placeholder="Enter Nagarpalika Tax"
              value={nagarpalika_tax}
              type='number'

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
              type='number'

              onChange={(e) => setParkRevenue(e.target.value)}
            />
          </Box>
          <Box mb={3}>
            <TextField
              id="outlined-select-category"
              select
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              helperText="Select a category"
            >
              {data.categories.map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" type="submit">
              Save Subcategory
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
