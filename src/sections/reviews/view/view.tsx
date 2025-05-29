'use client';

// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import DashboardContent from '../reviews-content';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useEffect, useState } from 'react';
import { fetchCommentsByStore, fetchReviews } from '@/redux/slices/reviewsSlice';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import { SplashScreen } from '@/components/loading-screen';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

export default function ReviewsView() {
  const settings = useSettingsContext();
  const [ratings, setRatings] = useState('all');
  const appDispatch = useAppDispatch();
  const { user } = useAuthContext();

  const reviews = useAppSelector((state) => state.reviewsSlice.reviews);
  const loading = useAppSelector((state) => state.reviewsSlice.loading);

  // Filter reviews by ratings
  let filteredReviews = reviews;
  if (ratings === '1-3') {
    filteredReviews = reviews.filter((r) => r.rating >= 1 && r.rating <= 3);
  } else if (ratings === '3-5') {
    filteredReviews = reviews.filter((r) => r.rating > 3 && r.rating <= 5);
  }

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      appDispatch(fetchReviews());
    } else if (user?.role === 'SELLER') {
      appDispatch(fetchCommentsByStore(user?.seller?.store?.id));
    }
  }, [user]);

  if (loading) return <SplashScreen />;

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        mt: -4,
      }}
    >
      <Stack
        direction={'row'}
        alignItems={'center'}
        justifyContent={'space-between'}
        spacing={2}
        sx={{ my: 3, p: 3 }}
      >
        <Typography variant="h4">Reviews Management</Typography>
        <Stack direction={'row'} spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Ratings</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={ratings}
              label="Ratings"
              onChange={(e) => {
                setRatings(e.target.value);
              }}
              size="small"
              sx={{
                minWidth: 100,
              }}
            >
              <MenuItem value={'all'}>All</MenuItem>
              <MenuItem value={'1-3'}>1-3</MenuItem>
              <MenuItem value={'3-5'}>3-5</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>

      <DashboardContent filteredReviews={filteredReviews} reviews={reviews} />
    </Container>
  );
}
