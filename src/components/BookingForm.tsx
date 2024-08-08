'use client';
import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { CREATE_BOOKING, UPDATE_BOOKING } from '@/graphql/mutations';
import { GET_CATEGORIES, GET_SUBCATEGORIES } from '@/graphql/queries';
import {
  Typography,
  Box,
  Grid,
  TextField,
  Select,
  MenuItem,
  TextareaAutosize,
  Button,
  CircularProgress,
  useTheme,
} from '@mui/material';

interface InitialData {
  name: string;
  phone: string;
  visitors: string;
  category: string;
  subcategory: string;
  price: string;
  pawanMediaRevenue: string;
  nagarpalikaTax: string;
  parkRevenue: string;
  paymentMethod: string;
  remarks: string;
}

export default function BookingForm({ initialData = {}, onClose }) {
  const router = useRouter();
  const theme = useTheme();
  const [formData, setFormData] = useState<InitialData>({
    name: '',
    phone: '',
    visitors: '',
    category: '',
    subcategory: '',
    price: '',
    pawanMediaRevenue: '',
    nagarpalikaTax: '',
    parkRevenue: '',
    paymentMethod: '',
    remarks: '',
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData((prevData) => ({
        ...prevData,
        ...initialData,
      }));
    }
  }, []);

  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES);
  const {
    data: subcategoriesData,
    loading: subcategoriesLoading,
    refetch: refetchSubcategories,
  } = useQuery(GET_SUBCATEGORIES, {
    variables: { categoryId: formData.category._id || formData.category },
    skip: !formData.category,
  });

  const [createBooking] = useMutation(CREATE_BOOKING, {
    onCompleted: () => {
      onClose();
      router.push('/booking/view');
    },
  });

  const [updateBooking] = useMutation(UPDATE_BOOKING, {
    onCompleted: () => {
      onClose();
      router.push('/booking/view');
    },
  });

  const updatePrice = (subcategoryId, visitors) => {
    const selectedSubcategory = subcategoriesData?.subCategories.find(
      (subcategory) => subcategory._id === subcategoryId
    );
    if (selectedSubcategory) {
      const visitorCount = parseInt(visitors) || 0;
      const newPrice = (selectedSubcategory.price * visitorCount).toFixed(2);
      const newPawanMediaRevenue = (selectedSubcategory.pawanmedia * visitorCount).toFixed(2);
      const newNagarpalikaTax = (selectedSubcategory.nagarpalika_tax * visitorCount).toFixed(2);
      const newParkRevenue = (selectedSubcategory.park * visitorCount).toFixed(2);

      setFormData((prevData) => {
        if (
          prevData.price === newPrice &&
          prevData.pawanMediaRevenue === newPawanMediaRevenue &&
          prevData.nagarpalikaTax === newNagarpalikaTax &&
          prevData.parkRevenue === newParkRevenue
        ) {
          return prevData;
        }
        return {
          ...prevData,
          price: newPrice,
          pawanMediaRevenue: newPawanMediaRevenue,
          nagarpalikaTax: newNagarpalikaTax,
          parkRevenue: newParkRevenue,
        };
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (name === 'category') {
      setFormData((prevData) => ({
        ...prevData,
        subcategory: '',
        price: '',
        pawanMediaRevenue: '',
        nagarpalikaTax: '',
        parkRevenue: '',
        [name]: value,
      }));
      refetchSubcategories({ categoryId: value });
    } else if (name === 'subcategory') {
      updatePrice(value, formData.visitors);
    } else if (name === 'visitors') {
      if (!isNaN(value)) {
        updatePrice(formData.subcategory, value);
      }
    }
  };

  const removeTypename = (key, value) => (key === '__typename' ? undefined : value);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mutation = initialData._id ? updateBooking : createBooking;
    const input = initialData._id ? 'updateBookingInput' : 'createBookingInput';

    const cleanedData = JSON.parse(JSON.stringify(formData), removeTypename);

    mutation({
      variables: {
        [input]: {
          ...cleanedData,
          visitors: parseInt(cleanedData.visitors),
          price: parseFloat(cleanedData.price),
          pawanMediaRevenue: parseFloat(cleanedData.pawanMediaRevenue),
          nagarpalikaTax: parseFloat(cleanedData.nagarpalikaTax),
          parkRevenue: parseFloat(cleanedData.parkRevenue),
          category: cleanedData.category._id || cleanedData.category,
          subcategory: cleanedData.subcategory._id || cleanedData.subcategory,
          _id: initialData?._id,
        },
      },
    });
  };

  return (
    <Box
      sx={{
        maxWidth: '2xl',
        mx: 'auto',
        p: { xs: 6, sm: 8 },
        bgcolor: 'white',
        borderRadius: 'lg',
        boxShadow: 'lg',
        '& .MuiInputLabel-root': {
          color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.text.primary,
        },
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: 'text.primary' }}>
        {initialData?._id ? 'Edit Booking' : 'Booking Form'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Name</Typography>
            <TextField
              fullWidth
              placeholder="Enter your name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Phone</Typography>
            <TextField
              fullWidth
              placeholder="Enter your phone number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Visitors</Typography>
            <TextField
              fullWidth
              placeholder="Enter number of visitors"
              type="number"
              name="visitors"
              value={formData.visitors}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Category</Typography>
            {categoriesLoading ? (
              <CircularProgress />
            ) : (
              <Select
                fullWidth
                name="category"
                value={formData.category._id || formData.category}
                onChange={handleChange}
                required
              >
                {categoriesData?.categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Subcategory</Typography>
            {subcategoriesLoading ? (
              <CircularProgress />
            ) : (
              <Select
                fullWidth
                name="subcategory"
                value={formData.subcategory._id || formData.subcategory}
                onChange={handleChange}
                required
                disabled={!formData.category}
              >
                {subcategoriesData?.subCategories.map((subcategory) => (
                  <MenuItem key={subcategory._id} value={subcategory._id}>
                    {subcategory.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Payment Method</Typography>
            <Select
              fullWidth
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              required
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="card">Card</MenuItem>
              <MenuItem value="online">Online</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Remarks</Typography>
            <TextareaAutosize
              minRows={3}
              maxRows={6}
              placeholder="Enter any remarks"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              style={{
                width: '100%',
                resize: 'none',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Price</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              रू {formData.price}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Pawan Media Revenue</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              रू {formData.pawanMediaRevenue}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Nagarpalika Tax</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              रू {formData.nagarpalikaTax}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total Park Revenue</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              रू {formData.parkRevenue}
            </Typography>
          </Grid>
        </Grid>
        <Box mt={6} display="flex" justifyContent="flex-end">
          <Button type="submit" variant="contained" color="primary">
            {initialData?._id ? 'Update Booking' : 'Submit Booking'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
