'use client';
import {  Container, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { useSettingsContext } from 'src/components/settings';
import BookingWidgetSummary from './reviews-widget-summary';
import { Icon } from '@iconify/react';
import { useAppSelector } from '@/redux/hooks';
import ProductDetailsReview from './reviews-details-review';



function DashboardContent() {
  const settings = useSettingsContext();
  const theme = useTheme();
  const reviews = useAppSelector(state => state.reviewsSlice.reviews)    
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', gap: 5, p: 0 }} maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        {[0, 1, 2, 3].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <BookingWidgetSummary
              title={["Total Sales", "Products", "Customers", "Reviews"][index]}
              total={[24780, 1240, 3427, 4.8][index]}
              color={[
                'rgba(252, 231, 243, 1)',
                'rgba(219, 234, 254, 1)',
                'rgba(229, 231, 235, 1)',
                'rgba(229, 231, 235, 1)',
              ][index]}
              type={['area', 'area', 'area', 'info'][index]}
              icon={
                <Icon
                  color={[theme.palette.primary.main, '#2563eb', '#059669', '#7c3aed'][index]}
                  icon={['famicons:bag', 'famicons:bag', 'gravity-ui:persons-lock', 'tabler:star-filled'][index]}
                  width="20"
                  height="20"
                />
              }
            />
          </Grid>
        ))}
      </Grid>
        {reviews.length > 0 && 
        <ProductDetailsReview
              reviews={reviews}
            />}

    </Container>
  );
}

export default DashboardContent;
