'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import BookingForm from '@/components/BookingForm';

export default function AddBooking() {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <BookingForm onClose={handleClose} />
  );
}
