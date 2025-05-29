'use client';
import { Container, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useEffect } from 'react';
import { useSettingsContext } from 'src/components/settings';
import BookingWidgetSummary from './reviews-widget-summary';
import { Icon } from '@iconify/react';
import { useAppSelector } from '@/redux/hooks';
import ProductDetailsReview from './reviews-details-review';

interface DashboardContentProps {
  filteredReviews: any[];
  reviews: any[];
}

function DashboardContent({ filteredReviews, reviews }: DashboardContentProps) {
  const settings = useSettingsContext();

  // Calculate real summary data
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? Number(
          (filteredReviews.reduce((sum, r) => sum + (r.rating || 0), 0) / totalReviews).toFixed(2)
        )
      : 0;
  const pendingReplies = reviews.filter(
    (r) => !r.commentReplies || r.commentReplies.length === 0
  ).length;
  const replied = reviews.length;

  const summaryData = [
    {
      title: 'Average Rating',
      total: averageRating,
      color: 'rgba(254, 243, 199, 1)',
      icon: 'iconoir:star-solid',
      iconColor: '#d97706',
    },
    {
      title: 'Total Reviews',
      total: totalReviews,
      color: 'rgba(219, 234, 254, 1)',
      icon: 'fa-solid:comment',
      iconColor: '#2563eb',
    },
    {
      title: 'Pending Replies',
      total: pendingReplies,
      color: 'rgba(255, 237, 213, 1)',
      icon: 'mingcute:time-fill',
      iconColor: '#ea580c',
    },
    {
      title: 'Replied',
      total: replied,
      color: 'rgba(209, 250, 229, 1)',
      icon: 'icon-park-solid:correct',
      iconColor: '#6bc8a7',
    },
  ];

  return (
    <Container
      sx={{ display: 'flex', flexDirection: 'column', gap: 5, p: 0 }}
      maxWidth={settings.themeStretch ? false : 'xl'}
    >
      <Grid container spacing={3}>
        {summaryData.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <BookingWidgetSummary
              title={item.title}
              total={item.total}
              color={item.color}
              type="info"
              icon={<Icon color={item.iconColor} icon={item.icon} width="20" height="20" />}
            />
          </Grid>
        ))}
      </Grid>
      {filteredReviews.length > 0 && <ProductDetailsReview reviews={filteredReviews} />}
    </Container>
  );
}

export default DashboardContent;
