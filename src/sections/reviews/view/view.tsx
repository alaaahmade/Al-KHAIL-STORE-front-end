'use client';

// @mui
import Container from '@mui/material/Container';
// components
import { useSettingsContext } from 'src/components/settings';
import DashboardContent from '../reviews-content';
import { useAppDispatch } from '@/redux/hooks';
import { useEffect, useState } from 'react';
import {  fetchReviews } from '@/redux/slices/reviewsSlice';
import { Box, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';

// ----------------------------------------------------------------------

export default function ReviewsView() {
  const settings = useSettingsContext();
  const [product, setProduct] = useState('all')
  const [ratings, setRatings] = useState('all')
  const appDispatch = useAppDispatch()

  useEffect(() => {
    appDispatch(fetchReviews())
  }, [])
  

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{
      mt: -4
    }}>  
      <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'} spacing={2} sx={{ my: 3, p: 3 }}>
        <Typography variant="h4">Reviews Management</Typography>
        <Stack direction={'row'} spacing={2} >
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Products</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={product}
            label="Products"
            onChange={(e) => {
              setProduct(e.target.value)
            }}
            size='small'
            sx={{
              minWidth: 100
            }}
          >
            <MenuItem value={'all'}>All Products</MenuItem>
            <MenuItem value={10}>10-store</MenuItem>
            <MenuItem value={20}>20-store</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Ratings</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={ratings}
            label="Ratings"
            onChange={(e) => {
              setRatings(e.target.value)
            }}
            size='small'
            sx={{
              minWidth: 100
            }}
          >
            <MenuItem value={'all'}>All</MenuItem>
            <MenuItem value={1-3}>1-3</MenuItem>
            <MenuItem value={3-5}>3-5</MenuItem>
          </Select>
        </FormControl>
        </Stack>
      </Stack>

      <DashboardContent />
    </Container>
  );
}
