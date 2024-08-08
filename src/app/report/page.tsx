'use client';
import React, { useState } from 'react';
import Report from '@/components/Report';
import MonthlyBookingReport from '@/components/MonthlyBookingReport';
import YearMonthSelector from '@/components/YearMonthSelector';

const Page = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('June');

  const handleYearMonthChange = (selectedYear, selectedMonth) => {
    setYear(selectedYear);
    setMonth(selectedMonth);
  };

  return (
    <div>
      <YearMonthSelector onYearMonthChange={handleYearMonthChange} />
      <Report year={year} />
      <MonthlyBookingReport year={year} month={month} />
    </div>
  );
};

export default Page;
