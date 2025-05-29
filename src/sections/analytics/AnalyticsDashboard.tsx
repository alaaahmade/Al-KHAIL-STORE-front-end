'use client';
import Iconify from 'src/components/iconify';
import {
  Container,
  Grid,
  Card,
  Typography,
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  LinearProgress,
  Select,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/auth/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchAnalyticsForAdmin, fetchAnalyticsForSeller } from '@/redux/slices/analyticsSlice';

const stats = [
  { label: 'Revenue', value: '$45,280', change: '+12.5%', positive: true },
  { label: 'Orders', value: '1,240', change: '+8.2%', positive: true },
  { label: 'Average Order Value', value: '$36.50', change: '-2.1%', positive: false },
  { label: 'Conversion Rate', value: '3.2%', change: '+0.8%', positive: true },
];
const topProducts = [
  { name: 'Luxury Face Cream', units: 2450, revenue: '$89,775' },
  { name: 'Anti-Aging Serum', units: 1890, revenue: '$75,600' },
];
const categories = [
  { name: 'Skincare', percent: 45 },
  { name: 'Makeup', percent: 30 },
  { name: 'Hair Care', percent: 25 },
];

const ranges = [
  { value: 'all', label: 'All' },
  { value: 'last7days', label: 'Last 7 days' },
  { value: 'lastmonth', label: 'Last month' },
  { value: 'lastyear', label: 'Last year' },
];

export default function AnalyticsDashboard() {
  const theme = useTheme();
  const [range, setRange] = useState('last7days');
  const { analytics } = useAppSelector((slice) => slice.AnalyticsSlice);
  const dispatch = useAppDispatch();
  const { user } = useAuthContext();

  function handleExportReport() {
    // Prepare Markdown data using real analytics from Redux store
    let md = '';
    // Stats Table
    md += '## Stats\n';
    md += '| Label | Value | Change | Positive |\n';
    md += '|-------|-------|--------|----------|\n';
    const statsData = [
      {
        label: 'Revenue',
        value: analytics?.revenue !== undefined ? `$${analytics.revenue.toLocaleString()}` : '-',
        change: analytics?.revenueChange || '-',
        positive: analytics?.revenueChange
          ? analytics.revenueChange.toString().startsWith('+')
            ? 'Yes'
            : 'No'
          : '-',
      },
      {
        label: 'Orders',
        value: analytics?.orderCount !== undefined ? analytics.orderCount.toLocaleString() : '-',
        change: analytics?.orderCountChange || '-',
        positive: analytics?.orderCountChange
          ? analytics.orderCountChange.toString().startsWith('+')
            ? 'Yes'
            : 'No'
          : '-',
      },
      {
        label: 'Average Order Value',
        value:
          analytics?.avgOrderValue !== undefined ? analytics.avgOrderValue.toLocaleString() : '-',
        change: analytics?.avgOrderValueChange || '-',
        positive: analytics?.avgOrderValueChange
          ? analytics.avgOrderValueChange.toString().startsWith('+')
            ? 'Yes'
            : 'No'
          : '-',
      },
      {
        label: 'Conversion Rate',
        value: analytics?.conversionRate !== undefined ? `${analytics.conversionRate}%` : '-',
        change: analytics?.conversionRateChange || '-',
        positive: analytics?.conversionRateChange
          ? analytics.conversionRateChange.toString().startsWith('+')
            ? 'Yes'
            : 'No'
          : '-',
      },
    ];
    statsData.forEach((stat) => {
      md += `| ${stat.label} | ${stat.value} | ${stat.change} | ${stat.positive} |\n`;
    });
    md += '\n';
    // Top Products Table
    md += '## Top Products\n';
    md += '| Name | Units Sold | Revenue |\n';
    md += '|------|-----------|---------|\n';
    if (analytics?.topProducts && analytics.topProducts.length > 0) {
      analytics.topProducts.forEach((prod: any) => {
        md += `| ${prod.name || '-'} | ${prod.unitsSold || '-'} | ${prod.revenue || '-'} |\n`;
      });
    } else {
      md += '| - | - | - |\n';
    }
    md += '\n';
    // Categories Table
    md += '## Sales by Category\n';
    md += '| Name | Percent |\n';
    md += '|------|---------|\n';
    if (analytics?.salesByCategory && analytics.salesByCategory.length > 0) {
      analytics.salesByCategory.forEach((cat: any) => {
        md += `| ${cat.name || '-'} | ${cat.percent !== undefined ? cat.percent + '%' : '-'} |\n`;
      });
    } else {
      md += '| - | - |\n';
    }
    // Create Markdown blob and trigger download
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics_report.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  useEffect(() => {
    if (user?.role.toLowerCase() === 'admin') {
      dispatch(fetchAnalyticsForAdmin());
    } else {
      dispatch(fetchAnalyticsForSeller(user?.seller?.store?.id));
    }
  }, [user, dispatch]);

  return (
    <Container maxWidth="xl" sx={{ py: 4, backgroundColor: theme.palette.grey[50] }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }} fontWeight={700} gutterBottom>
        Sales Analytics
      </Typography>
      <Box display="flex" alignItems="center" mb={3} gap={2}>
        <Select
          size="small"
          value={range}
          onChange={(e) => setRange(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {ranges.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>
        <Button
          variant="contained"
          sx={{
            bgcolor: theme.palette.primary.main,
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleExportReport}
        >
          Export Report
        </Button>
      </Box>
      <Grid container spacing={3} mb={3}>
        {[
          {
            label: 'Revenue',
            value: analytics?.revenue ? `$${analytics.revenue.toLocaleString()}` : '-',
            icon: (
              <Box
                sx={{
                  bgcolor: '#FDECEF',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify color="#F06292" icon="fa:usd" width={20} height={20} />
              </Box>
            ),
            change: '+12.5%',
            changeText: '+12.5% vs last month',
            changeColor: 'success.main',
            valueColor: 'text.primary',
          },
          {
            label: 'Orders',
            value: analytics?.orderCount ? `${analytics.orderCount.toLocaleString()}` : '-',
            icon: (
              <Box
                sx={{
                  bgcolor: '#E3F1FD',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify color="#42A5F5" icon="mdi:cart" width={20} height={20} />
              </Box>
            ),
            change: '+8.2%',
            changeText: '+8.2% vs last month',
            changeColor: 'success.main',
            valueColor: 'text.primary',
          },
          {
            label: 'Average Order Value',
            value: analytics?.avgOrderValue ? `${analytics.avgOrderValue.toLocaleString()}` : '-',
            icon: (
              <Box
                sx={{
                  bgcolor: '#F3E8FD',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify color="#BA68C8" icon="carbon:analytics" width={20} height={20} />
              </Box>
            ),
            change: '-2.1%',
            changeText: '-2.1% vs last month',
            changeColor: 'error.main',
            valueColor: 'error.main',
          },
          {
            label: 'Conversion Rate',
            value: analytics?.conversionRate ? `${analytics.conversionRate}%` : '-',
            icon: (
              <Box
                sx={{
                  bgcolor: '#E2F8F0',
                  p: 1,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify color="#26A69A" icon="ic:baseline-divide" width={20} height={20} />
              </Box>
            ),
            change: '+0.8%',
            changeText: '+0.8% vs last month',
            changeColor: 'success.main',
            valueColor: 'text.primary',
          },
        ].map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card
              sx={{
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 120,
                borderRadius: 3,
                boxShadow: 'none',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 0.5, fontSize: 13 }}
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h5"
                    fontWeight={700}
                    color={stat.valueColor}
                    sx={{ mb: 0.5, fontSize: 22 }}
                  >
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color={stat.changeColor} sx={{ fontSize: 13 }}>
                    {stat.changeText}
                  </Typography>
                </Box>
                <Box>{stat.icon}</Box>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Top Selling Products
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <List sx={{ p: 2 }}>
              {analytics &&
                analytics.topProducts &&
                analytics.topProducts.length > 0 &&
                analytics?.topProducts?.map((prod: any, idx: any) => (
                  <ListItem sx={{ mb: 2 }} key={prod.id}>
                    <ListItemText
                      sx={{ backgroundColor: theme.palette.grey[50] }}
                      primary={
                        <Box display="flex" alignItems="center">
                          <Typography fontWeight={700} mr={2}>
                            {idx + 1}.
                          </Typography>
                          {prod.name}
                        </Box>
                      }
                      secondary={
                        <Typography
                          sx={{ fontSize: 13, ml: 3 }}
                          variant="body2"
                          color="text.secondary"
                        >
                          {prod.unitsSold} units sold
                        </Typography>
                      }
                    />
                    <Typography fontWeight={700}>{prod.revenue}</Typography>
                  </ListItem>
                ))}
            </List>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" mb={1}>
              Sales by Category
            </Typography>
            {analytics &&
              analytics.salesByCategory &&
              analytics.salesByCategory.length > 0 &&
              analytics.salesByCategory.map((cat: any) => (
                <Box key={cat.name} mb={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body2">{cat.name}</Typography>
                    <Typography variant="body2">{cat.percent}%</Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={cat.percent}
                    sx={{
                      height: 8,
                      borderRadius: 5,
                      bgcolor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': { bgcolor: theme.palette.primary.main },
                    }}
                  />
                </Box>
              ))}
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
