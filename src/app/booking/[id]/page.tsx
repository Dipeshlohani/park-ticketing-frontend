// src/pages/booking/[id].tsx
'use client';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { useRouter } from 'next/router';
import { Grid, Typography, Box } from '@mui/material';

const GET_BOOKING = gql`
  query GetBooking($id: ID!) {
    booking(id: $id) {
      id
      name
      visitors
      category
      subcategory
      price
      pawanMediaRevenue
      nagarpalikaTax
      parkRevenue
      phone
      paymentMethod
      createdAt
      createdBy
      remarks
    }
  }
`;

export default function ViewBooking() {
  const router = useRouter();
  const { id } = router.query;

  const { loading, error, data } = useQuery(GET_BOOKING, {
    variables: { id },
  });

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  const booking = data.booking;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Booking Details</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">ID:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.id}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Name:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.name}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Phone:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.phone}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Visitors:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.visitors}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Category:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.category}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Subcategory:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.subcategory}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Price:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.price}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Pawan Media Revenue:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.pawanMediaRevenue}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Nagarpalika Tax:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.nagarpalikaTax}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Park Revenue:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.parkRevenue}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Payment Method:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.paymentMethod}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Created At:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.createdAt}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Created By:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.createdBy}</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography variant="subtitle1">Remarks:</Typography></Grid>
        <Grid item xs={12} sm={6}><Typography>{booking.remarks}</Typography></Grid>
      </Grid>
    </Box>
  );
}
