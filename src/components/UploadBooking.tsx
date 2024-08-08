// src/pages/UploadBooking.tsx

'use client';
import React, { useState } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import axios from 'axios';
import { useSnackbar } from '@/components/Snackbar';

export default function UploadBookingPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      showSnackbar('Please select a file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);

    try {
      await axios.post('http://localhost:4000/booking/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSnackbar('File uploaded successfully', 'success');
      setFile(null);
    } catch (error) {
      showSnackbar('Failed to upload file', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'background.default',
      }}
    >

      <Box p={1}>
        <input
          accept=".xlsx, .xls"
          id="file-upload"
          type="file"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload">
          <Button variant="contained" color="primary" component="span" startIcon={<UploadFileIcon />}>
            Select File
          </Button>
        </label>
      </Box>
      {file && <Typography variant="body1" gutterBottom>{file.name}</Typography>}
      <Box display="flex" justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleUpload} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Upload'}
        </Button>
      </Box>
    </Box>
  );
}
