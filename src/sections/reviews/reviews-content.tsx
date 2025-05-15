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
  const reviews = useAppSelector(state => state.reviewsSlice.reviews)    
  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', gap: 5, p: 0 }} maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        {[0, 1, 2, 3].map((_, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <BookingWidgetSummary
              title={["Average Rating", "Total Reviews", "Pending Replies", "Replied"][index]}
              total={[4.8, 1240, 24, 892][index]}
              color={[
                'rgba(254, 243, 199, 1)',
                'rgba(219, 234, 254, 1)',
                'rgba(255, 237, 213, 1)',
                'rgba(209, 250, 229, 1)',
              ][index]}
              type={['info', 'info', 'info', 'info'][index]}
              icon={
                <Icon
                  color={['#d97706', '#2563eb', '#ea580c', '#6bc8a7'][index]}
                  icon={['iconoir:star-solid', 'fa-solid:comment', 'mingcute:time-fill', 'icon-park-solid:correct'][index]}
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
