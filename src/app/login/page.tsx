// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import { Typography, Card, TextField, Button, Link } from '@mui/material';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed', err);
    }
  };

  return (
    <div style={{ height: '100vh', background: 'linear-gradient(to bottom right, #2ecc71, #16a085)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ minWidth: 550 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 35 }}>
          <ConfirmationNumberIcon sx={{ fontSize: '2.5rem', color: '#2ecc71', marginBottom: 2 }} />
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <Typography variant="h5" sx={{ color: '#2ecc71', marginBottom: 2, fontWeight: 'bold' }}>Ticketing Admin</Typography>
            <Typography variant="body1" sx={{ color: 'rgba(0, 0, 0, 0.54)' }}>Sign in to your account to manage your tickets.</Typography>
          </div>
          <form style={{ width: '100%', maxWidth: 500 }} onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <Typography sx={{ color: '#2ecc71', marginBottom: 2 }} htmlFor="email">Email</Typography>
              <TextField
                id="email"
                placeholder="m@example.com"
                required
                type="email"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <Typography sx={{ color: '#2ecc71' }} htmlFor="password">Password</Typography>
                <Link href="#" variant="body2" sx={{ color: '#2ecc71', '&:hover': { color: '#1abc9c' } }}>Forgot password?</Link>
              </div>
              <TextField
                id="password"
                required
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              variant="contained"
              sx={{ backgroundColor: '#2ecc71', color: 'white', '&:hover': { backgroundColor: '#1abc9c' } }}
              type="submit"
              fullWidth
            >
              Sign in
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
