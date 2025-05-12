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
import { fetchLatestReviews } from '@/redux/slices/reviewsSlice';
import ProductDetailsReview from '../product-details-review';

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();
  const appDispatch = useAppDispatch()
  const latestReviews = useAppSelector(state => state.reviewsSlice.latestReviews)

  useEffect(() => {
    appDispatch(fetchLatestReviews())
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
