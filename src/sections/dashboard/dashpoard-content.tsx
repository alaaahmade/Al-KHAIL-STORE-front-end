import {  Button, Container, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { BookingIllustration, CheckInIllustration, CheckOutIllustration } from 'src/assets/illustrations';
import { useSettingsContext } from 'src/components/settings';
import BookingWidgetSummary from './dashpoard-widget-summary';
import BookingTotalIncomes from './dashpoard-total-incomes';
import SoonAlert from './soon-alert';
import BookingStatistics from './dashpoard-statistics';
import BookingAvailable from './dashpoard-available';

const items = [
  {
    id: 1,
    title: 'Yoga Class With Yara',
    date: '2:00 PM - 3:00PM',
  },
  {
    id: 2,
    title: 'Padel KHAIL Reservation',
    date: '2:00 PM - 3:00PM',
  },
];

function DashboardContent() {
  const settings = useSettingsContext();
  const theme = useTheme();

  return (
    <Container sx={{ display: 'flex', flexDirection: 'column', gap: 5 }} maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3} gap={3}>
        <Grid item xs={12} md={3.8}>
          <BookingWidgetSummary
            title="Total Booking"
            total={714000}
            icon={<BookingIllustration />}
          />
        </Grid>

        <Grid item xs={12} md={3.8}>
          <BookingWidgetSummary title="Sold" total={311000} icon={<CheckInIllustration />} />
        </Grid>

        <Grid item xs={12} md={3.8}>
          <BookingWidgetSummary title="Canceled" total={124000} icon={<CheckOutIllustration />} />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={3}
        justifyContent="space-between"
        sx={{
          gridTemplateColumns: '2fr 1fr', // 2fr for the first column, 1fr for the second column
        }}
      >
        <Grid item xs={12} md={7}>
          <BookingTotalIncomes
            sx={{ mb: 3}}
            title="Total Incomes"
            total={18765}
            percent={2.6}
            chart={{
              series: [
                { x: 2016, y: 111 },
                { x: 2017, y: 136 },
                { x: 2018, y: 76 },
                { x: 2019, y: 108 },
                { x: 2020, y: 74 },
                { x: 2021, y: 54 },
                { x: 2022, y: 57 },
                { x: 2023, y: 84 },
              ],
            }}
          />
        <BookingStatistics
          sx={{ mb: 3}}
          title="Statistics"
          subheader="(+43% Check In | +12% Check Out) than last year"
          chart={{
            colors: [theme.palette.primary.main, theme.palette.error.light],
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
            series: [
              {
                type: 'Week',
                data: [
                  {
                    name: 'Sold',
                    data: [10, 41, 35, 151, 49, 62, 69, 91, 48],
                  },
                  {
                    name: 'Canceled',
                    data: [10, 34, 13, 56, 77, 88, 99, 77, 45],
                  },
                ],
              },
              {
                type: 'Month',
                data: [
                  {
                    name: 'Sold',
                    data: [148, 91, 69, 62, 49, 51, 35, 41, 10],
                  },
                  {
                    name: 'Canceled',
                    data: [45, 77, 99, 88, 77, 56, 13, 34, 10],
                  },
                ],
              },
              {
                type: 'Year',
                data: [
                  {
                    name: 'Sold',
                    data: [76, 42, 29, 41, 27, 138, 117, 86, 63],
                  },
                  {
                    name: 'Canceled',
                    data: [80, 55, 34, 114, 80, 130, 15, 28, 55],
                  },
                ],
              },
            ],
          }}
        />

      <Container sx={{
        backgroundColor: '#B71D18',
        p: 3
      }} >
        <Typography variant="h5" sx={{ mb: 3, color: '#fff' }}>
        [FOR TESTING ONLY]
        </Typography>
        <Button
          sx={{
            backgroundColor: '#FFAB00',
            p:1,
            pl: 1.5,
            pr: 1.5,
            borderRadius: 1
          }}
        >
        Failed scan attempt
        </Button>
      </Container>
        </Grid>
        <Grid item xs={12} md={5} >

          <SoonAlert 
          sx={{ mb: 3}}
          title="Starting soon" color="warning" items={items} />

        <SoonAlert
          sx={{ mb: 3}}
            title="Starting soon" color="error" items={items} />

            <BookingAvailable
              title="Class Attendance"
              chart={{
                series: [
                  { label: 'Attended', value: 120 },
                  { label: 'No-show', value: 66 },
                ],
              }}
            />

          </Grid>



      </Grid>

    </Container>
  );
}

export default DashboardContent;
