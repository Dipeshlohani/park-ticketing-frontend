'use client';
import React, { useRef } from 'react';
import { useQuery } from '@apollo/client';
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/GetApp';
import PrinterIcon from '@mui/icons-material/Print';
import * as XLSX from 'xlsx';

import { GET_MONTHLY_BOOKINGS } from '@/graphql/queries';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? theme.palette.grey[700]
      : theme.palette.grey[100],
  color:
    theme.palette.mode === 'dark'
      ? theme.palette.common.white
      : theme.palette.grey[700],
  fontSize: '0.875rem',
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function MonthlyBookingsReport({ year, month }) {
  const reportRef = useRef();

  const { loading, error, data } = useQuery(GET_MONTHLY_BOOKINGS, {
    variables: { year, month },
  });

  const handlePrint = () => {
    const printContent = reportRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
      <head>
        <title>Print Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
        </style>
      </head>
      <body>
        ${printContent}
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
  };

  const handleExport = () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      [
        'S.No.',
        'Name',
        'Phone',
        'Visitors',
        'Category',
        'Subcategory',
        'Price',
        'Pawan Media Revenue',
        'Nagarpalika Tax',
        'Park Revenue',
        'Payment Method',
        'Remarks',
        'Created At',
      ],
    ];

    if (data && data.getMonthlyBookings && data.getMonthlyBookings.bookings) {
      data.getMonthlyBookings.bookings.forEach((booking, index) => {
        wsData.push([
          index + 1,
          booking.name,
          booking.phone,
          booking.visitors,
          booking.category.name || booking.category,
          booking.subcategory.name || booking.subcategory,
          booking.price,
          booking.pawanMediaRevenue,
          booking.nagarpalikaTax,
          booking.parkRevenue,
          booking.paymentMethod,
          booking.remarks,
          new Date(booking.createdAt).toLocaleDateString(),
        ]);
      });

      wsData.push([
        'Total',
        '',
        '',
        '',
        '',
        '',
        '',
        data.getMonthlyBookings.totals.pawanMediaRevenue,
        data.getMonthlyBookings.totals.nagarpalikaTax,
        data.getMonthlyBookings.totals.parkRevenue,
        '',
        '',
        '',
      ]);
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Report');
    XLSX.writeFile(wb, 'monthly_report.xlsx');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error loading data</Typography>;

  const { bookings, totals } = data.getMonthlyBookings;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: 3, py: 4 }}>
      <Grid container alignItems="center" justifyContent="space-between" mb={3}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {month} {year}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: { xs: 'center', md: 'flex-end' },
              gap: 2,
            }}
          >
            <Button
              onClick={handleExport}
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
            >
              Export
            </Button>
            <Button
              onClick={handlePrint}
              variant="outlined"
              size="small"
              startIcon={<PrinterIcon />}
            >
              Print
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box ref={reportRef} sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No.</StyledTableCell>
              <StyledTableCell>Name</StyledTableCell>
              <StyledTableCell>Ticket No.</StyledTableCell>
              <StyledTableCell>Phone</StyledTableCell>
              <StyledTableCell>Visitors</StyledTableCell>
              <StyledTableCell>Category</StyledTableCell>
              <StyledTableCell>Subcategory</StyledTableCell>
              <StyledTableCell>Price</StyledTableCell>
              <StyledTableCell>Pawan Media Revenue</StyledTableCell>
              <StyledTableCell>Nagarpalika Tax</StyledTableCell>
              <StyledTableCell>Park Revenue</StyledTableCell>
              <StyledTableCell>Payment Method</StyledTableCell>
              <StyledTableCell>Remarks</StyledTableCell>
              <StyledTableCell>Created At</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking, index) => (
              <StyledTableRow key={booking._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{booking.name}</TableCell>
                <TableCell>{booking.ticket_no}</TableCell>
                <TableCell>{booking.phone}</TableCell>
                <TableCell>{booking.visitors}</TableCell>
                <TableCell>
                  {booking.category.name || booking.category}
                </TableCell>
                <TableCell>
                  {booking.subcategory.name || booking.subcategory}
                </TableCell>
                <TableCell>{booking.price}</TableCell>
                <TableCell>{booking.pawanMediaRevenue}</TableCell>
                <TableCell>{booking.nagarpalikaTax}</TableCell>
                <TableCell>{booking.parkRevenue}</TableCell>
                <TableCell>{booking.paymentMethod}</TableCell>
                <TableCell>{booking.remarks}</TableCell>
                <TableCell>
                  {new Date(booking.createdAt).toLocaleDateString()}
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Total</StyledTableCell>
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell>{totals.price}</StyledTableCell>
              <StyledTableCell>{totals.pawanMediaRevenue}</StyledTableCell>
              <StyledTableCell>{totals.nagarpalikaTax}</StyledTableCell>
              <StyledTableCell>{totals.parkRevenue}</StyledTableCell>
              <StyledTableCell />
              <StyledTableCell />
              <StyledTableCell />
            </StyledTableRow>
          </TableHead>
        </Table>
      </Box>
    </Box>
  );
}
