import React, { useEffect } from 'react';
import { Box, Grid, Typography, Divider } from '@mui/material';
import QRCode from 'qrcode.react';

export default function Ticket({ booking }) {
  if (!booking) {
    return null; // Handle case where booking is not passed correctly
  }
  return (
    <Box
      bgcolor="background.paper"
      p={3}
      borderRadius={2}
      boxShadow={3}
      maxWidth={500}
      mx="auto"
    >
      <Grid container spacing={2} mb={3}>
        <Grid item xs={6}>
          <Typography variant="body2" color="textSecondary">
            Registered no.
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            8923749823
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="body2" color="textSecondary">
            PAN no.
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            2987341290
          </Typography>
        </Grid>
      </Grid>

      <Box display="flex" alignItems="center" justifyContent="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <FlagIcon style={{ width: '32px', height: '32px' }} />
          <Typography variant="h6" fontWeight="bold">
            Sahid Smarak Prakriti Pratisthan
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" ml="auto">
          Thankot, Tribhuvan Park
        </Typography>
        <QRCode value={booking.qrCodeData} />
      </Box>

      <Divider variant="middle" />

      <Box pt={3} mb={3}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="textSecondary">
            Ticket no.
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {booking.ticket_no}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="textSecondary">
            Name
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {booking.name}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="textSecondary">
            Tickets
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {booking.visitors}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="textSecondary">
            Category
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {booking.category.name || booking.category}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="textSecondary">
            Subcategory
          </Typography>
          <Typography variant="body1" fontWeight="medium">
            {booking.subcategory.name || booking.subcategory}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="body2" color="textSecondary">
          Phone: {booking.phone}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Date: {new Date(booking.createdAt).toLocaleString()}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="body2" color="textSecondary">
          Per Ticket
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          Rs.{booking.price / booking.visitors}
        </Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="body2" color="textSecondary">
          Subtotal (incl. tax)
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          Rs.{booking.price}
        </Typography>
      </Box>

      <Typography
        variant="body2"
        color="textSecondary"
        textAlign="center"
        mb={3}
      >
        Thank you for visiting! 🙏🏾
      </Typography>

      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2" color="textSecondary">
          Powered by Pawan Media
        </Typography>
        <PawPrintIcon style={{ width: '64px', height: '32px' }} />
      </Box>
    </Box>
  );
}

function FlagIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" x2="4" y1="22" y2="15" />
    </svg>
  );
}

function PawPrintIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="4" r="2" />
      <circle cx="18" cy="8" r="2" />
      <circle cx="20" cy="16" r="2" />
      <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
    </svg>
  );
}
