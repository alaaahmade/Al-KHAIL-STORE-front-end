'use client';

// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { fDate } from 'src/utils/format-time';
import DashboardContent from '../dashpoard-content';
import { Button } from '@mui/material';
import { useAuthContext } from '@/auth/hooks';
import axiosInstance, { endpoints } from '@/utils/axios';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect } from 'react';
import { fetchLatestReviews, fetchReviews } from '@/redux/slices/reviewsSlice';
import ProductDetailsReview from '../product-details-review';
import { fetchLatestOrders } from '@/redux/slices/ordersSlice';
import { useDispatch } from 'react-redux';
import { fetchSellers } from '@/redux/slices/SellersSlice';
import { fetchCustomers, fetchUsers } from '@/redux/slices/userSlice';
import { fetchProducts } from '@/redux/slices/productsReducer';

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();
  const appDispatch = useAppDispatch()
  const latestReviews = useAppSelector(state => state.reviewsSlice.latestReviews)

  useEffect(() => {
    appDispatch(fetchLatestReviews())
    appDispatch(fetchReviews())
    appDispatch(fetchCustomers())
    appDispatch(fetchLatestOrders())
    appDispatch(fetchProducts())
  }, [])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>  
      <DashboardContent />
    <Container maxWidth={settings.themeStretch ? false : 'xl'}  sx={{p: 4}}>
      <ProductDetailsReview
            reviews={latestReviews}
          />
    </Container>
    </Container>
  );
}
