import React, { useEffect, useState, useRef } from 'react';
import { useQuery } from '@apollo/client';
import { Typography, Button, Box, Grid, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/GetApp';
import PrinterIcon from '@mui/icons-material/Print';
import * as XLSX from 'xlsx';

import { GET_YEARLY_REPORT } from '@/graphql/queries';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[100],
  color: theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.grey[700],
  fontSize: '0.875rem',
  fontWeight: 'bold',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export default function Report({ year }) {
  const reportRef = useRef(null);

  const { loading, error, data } = useQuery(GET_YEARLY_REPORT, {
    variables: { year },
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
      ['S.No.', 'Month', 'Pawan Media', 'Nagarpalika Tax', 'Park Revenue', 'Total', 'Paid to TTP', 'Total Sales'],
    ];

    if (data && data.getYearlyReport && data.getYearlyReport.monthlyReports) {
      data.getYearlyReport.monthlyReports.forEach((row, index) => {
        wsData.push([
          index + 1,
          row.month,
          `रू ${row.pawanMedia?.toFixed(2)}`,
          `रू ${row.chandragiriMunicipality?.toFixed(2)}`,
          `रू ${row.thankotTribhuwanPark?.toFixed(2)}`,
          `रू ${row.total?.toFixed(2)}`,
          `रू ${row.paidToTTP?.toFixed(2)}`,
          `रू ${row.totalSales?.toFixed(2)}`,
        ]);
      });

      wsData.push([
        'Total',
        '',
        `रू ${data.getYearlyReport.monthlyReports.reduce((acc, cur) => acc + cur.pawanMedia, 0)?.toFixed(2)}`,
        `रू ${data.getYearlyReport.monthlyReports.reduce((acc, cur) => acc + cur.chandragiriMunicipality, 0)?.toFixed(2)}`,
        `रू ${data.getYearlyReport.monthlyReports.reduce((acc, cur) => acc + cur.thankotTribhuwanPark, 0)?.toFixed(2)}`,
        `रू ${data.getYearlyReport.monthlyReports.reduce((acc, cur) => acc + cur.total, 0)?.toFixed(2)}`,
        `रू ${data.getYearlyReport.monthlyReports.reduce((acc, cur) => acc + cur.paidToTTP, 0)?.toFixed(2)}`,
        `रू ${data.getYearlyReport.monthlyReports.reduce((acc, cur) => acc + cur.totalSales, 0)?.toFixed(2)}`,
      ]);
    }

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, 'report.xlsx');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error loading data</Typography>;

  const { getYearlyReport } = data;

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', px: { xs: 2, md: 3 }, py: 1 }}>
      <Grid container alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">Booking Report</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={handleExport} variant="outlined" size="small" startIcon={<DownloadIcon />}>Export</Button>
          <Button onClick={handlePrint} variant="outlined" size="small" startIcon={<PrinterIcon />}>Print</Button>
        </Box>
      </Grid>
      <Box ref={reportRef} sx={{ overflowX: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No.</StyledTableCell>
              <StyledTableCell>Month</StyledTableCell>
              <StyledTableCell>Pawan Media</StyledTableCell>
              <StyledTableCell>Nagarpalika Tax</StyledTableCell>
              <StyledTableCell>Park Revenue</StyledTableCell>
              <StyledTableCell>Total</StyledTableCell>
              <StyledTableCell>Paid to TTP</StyledTableCell>
              <StyledTableCell>Total Sales</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getYearlyReport.monthlyReports?.map((row, index) => (
              <StyledTableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.month}</TableCell>
                <TableCell>{`रू ${row.pawanMedia?.toFixed(2)}`}</TableCell>
                <TableCell>{`रू ${row.chandragiriMunicipality?.toFixed(2)}`}</TableCell>
                <TableCell>{`रू ${row.thankotTribhuwanPark?.toFixed(2)}`}</TableCell>
                <TableCell>{`रू ${row.total?.toFixed(2)}`}</TableCell>
                <TableCell>{`रू ${row.paidToTTP?.toFixed(2)}`}</TableCell>
                <TableCell>{`रू ${row.totalSales?.toFixed(2)}`}</TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Total</StyledTableCell>
              <StyledTableCell />
              <StyledTableCell>{`रू ${getYearlyReport.monthlyReports.reduce((acc, cur) => acc + cur.pawanMedia, 0)?.toFixed(2)}`}</StyledTableCell>
              <StyledTableCell>{`रू ${getYearlyReport.monthlyReports.reduce((acc, cur) => acc + cur.chandragiriMunicipality, 0)?.toFixed(2)}`}</StyledTableCell>
              <StyledTableCell>{`रू ${getYearlyReport.monthlyReports.reduce((acc, cur) => acc + cur.thankotTribhuwanPark, 0)?.toFixed(2)}`}</StyledTableCell>
              <StyledTableCell>{`रू ${getYearlyReport.monthlyReports.reduce((acc, cur) => acc + cur.total, 0)?.toFixed(2)}`}</StyledTableCell>
              <StyledTableCell>{`रू ${getYearlyReport.monthlyReports.reduce((acc, cur) => acc + cur.paidToTTP, 0)?.toFixed(2)}`}</StyledTableCell>
              <StyledTableCell>{`रू ${getYearlyReport.monthlyReports.reduce((acc, cur) => acc + cur.totalSales, 0)?.toFixed(2)}`}</StyledTableCell>
            </StyledTableRow>
          </TableHead>
        </Table>
      </Box>
    </Box>
  );
}
