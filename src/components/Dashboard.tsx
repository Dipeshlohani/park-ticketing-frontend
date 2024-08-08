// src/components/Dashboard.tsx

import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import {
  Grid,
  Typography,
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  Divider,
} from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ConfirmationNumber,
  Wallet,
  People,
  AccountCircleOutlined,
} from '@mui/icons-material';
import { DASHBOARD_QUERY, GET_USER_COUNTS, GET_CATEGORY_SHARE, GET_SUBCATEGORY_SHARE } from '@/graphql/queries';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FC408A'];

interface RevenueData {
  total: number;
  yearly: number;
  monthly: number;
  weekly: number;
  daily: number;
}

interface DashboardData {
  overallRevenue: RevenueData;
  pawanMediaRevenue: RevenueData;
  nagarpalikaTax: RevenueData;
  parkRevenue: RevenueData;
  bookedTickets: RevenueData;
  visitors: RevenueData;
  totalUsers: number;
  admins: number;
  staffs: number;
}

interface CategoryShare {
  category: string;
  count: number;
}

export default function Dashboard() {
  const [counts, setCounts] = useState({
    totalUsers: 0,
    staffCount: 0,
    directorCount: 0,
    adminCount: 0,
  });

  const { data, loading, error } = useQuery<{ dashboard: DashboardData }>(DASHBOARD_QUERY);
  const { loading: countloading, error: counterror, data: countdata } = useQuery(GET_USER_COUNTS);
  const { loading: categoryLoading, error: categoryError, data: categoryData } = useQuery(GET_CATEGORY_SHARE);
  const { loading: subcategoryLoading, error: subcategoryError, data: subcategoryData } = useQuery(GET_SUBCATEGORY_SHARE);

  useEffect(() => {
    if (countdata) {
      setCounts(countdata?.getUserCounts);
    }
  }, [countdata]);

  if (countloading || categoryLoading || subcategoryLoading || loading) return <CircularProgress />;
  if (counterror || categoryError || subcategoryError) return <p>Error: {counterror?.message || categoryError?.message || subcategoryError?.message}</p>;

  if (error) return <Typography>Error loading data</Typography>;

  const {
    overallRevenue,
    pawanMediaRevenue,
    nagarpalikaTax,
    parkRevenue,
    bookedTickets,
    visitors,
  } = data!.dashboard;

  const revenueCards = [
    { title: 'Overall Revenue', data: overallRevenue, icon: <Wallet />, gradient: 'linear-gradient(to bottom right, #3B82F6, #8B5CF6)' },
    { title: 'Pawan Media Revenue', data: pawanMediaRevenue, icon: <ConfirmationNumber />, gradient: 'linear-gradient(to bottom right, #22c55e, #14b8a6)' },
    { title: 'Nagarpalika Tax', data: nagarpalikaTax, icon: <ConfirmationNumber />, gradient: 'linear-gradient(to bottom right, #f97316, #ef4444)' },
    { title: 'Park Revenue', data: parkRevenue, icon: <Wallet />, gradient: 'linear-gradient(to bottom right, #3B82F6, #8B5CF6)' },
    { title: 'Booked Tickets', data: bookedTickets, icon: <ConfirmationNumber />, gradient: 'linear-gradient(to bottom right, #22c55e, #14b8a6)' },
    { title: 'Visitors', data: visitors, icon: <People />, gradient: 'linear-gradient(to bottom right, #f97316, #ef4444)' },
  ];

  const categoryShare = categoryData?.getCategoryShare || [];
  const subcategoryShare = subcategoryData?.getSubCategoryShare || [];

  return (
    <>
      <Grid container spacing={3} >
        {revenueCards.map(({ title, data, icon, gradient }, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                background: gradient,
                color: 'white',
                borderRadius: '8px',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                },
              }}
            >
              <CardHeader
                title={
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {icon}
                    <Typography variant="h6" style={{ color: 'white' }}>
                      {title}
                    </Typography>
                  </div>
                }
                subheader={
                  <Typography variant="body2" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    {`Total  from ${title.toLowerCase()}`}
                  </Typography>
                }
              />
              <CardContent>
                <Grid container spacing={2}>
                  {Object.entries(data).filter(([key]) => key !== '__typename').map(([key, value]) => (
                    <Grid item xs={6} key={key}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                        {value}
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </Typography>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3} p={1}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(to bottom right, #4FD1C5, #22D3EE)',
              color: 'white',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            <CardHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccountCircleOutlined style={{ width: 24, height: 24 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Total Users
                  </Typography>
                </div>
              }
              subheader={
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  All registered users
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {counts?.totalUsers}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(to bottom right, #6EE7B7, #34D399)', // from-emerald-500 to-green-500
              color: 'white',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            <CardHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccountCircleOutlined style={{ width: 24, height: 24 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Admins
                  </Typography>
                </div>
              }
              subheader={
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  Users with admin privileges
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {counts.adminCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(to bottom right, #FFA000, #FF6F00)',
              color: 'white',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            <CardHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccountCircleOutlined style={{ width: 24, height: 24 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Staffs
                  </Typography>
                </div>
              }
              subheader={
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  Users with staff privileges
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {counts.staffCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              background: 'linear-gradient(to bottom right, #8B5CF6, #3B82F6)',
              color: 'white',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
              },
            }}
          >
            <CardHeader
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <AccountCircleOutlined style={{ width: 24, height: 24 }} />
                  <Typography variant="h6" sx={{ color: 'white' }}>
                    Directors
                  </Typography>
                </div>
              }
              subheader={
                <Typography
                  variant="body2"
                  sx={{ color: 'rgba(255, 255, 255, 0.7)' }}
                >
                  Users with director privileges
                </Typography>
              }
            />
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {counts.directorCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={6}>
          <Card>
            {/* <CardHeader title="Category Share" /> */}
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={categoryShare}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {categoryShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            {/* <CardHeader title="Sub Category Share" /> */}
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <PieChart>
                  <Pie
                    data={subcategoryShare}
                    dataKey="count"
                    nameKey="subcategory"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {subcategoryShare.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
