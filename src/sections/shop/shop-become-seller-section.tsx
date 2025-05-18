import React from 'react';
import { Box, Grid, Typography, Button, List, ListItem, ListItemIcon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const benefits = [
  'Easy store setup and management',
  'Secure payments and transactions',
  'Marketing and promotional tools',
];

const ShopBecomeSellerSection = () => (
  <Box
    sx={{
      width: '100%',
      py: { xs: 6, md: 5 },
      px: 0,
      overflow: 'hidden',
      background: 'linear-gradient(90deg, #fff6fb 0%, #f3e9fd 100%)',
      minHeight: { md: 420 },
      mb: 4,mt: 5
    }}
  >
    <Grid
      container
      spacing={0}
      alignItems="center"
      justifyContent="center"
      sx={{ maxWidth: '1200px', mx: 'auto' }}
    >
      {/* Left Column */}
      <Grid item xs={12} md={6} sx={{ pr: { md: 8 }, pl: { md: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 3,
            fontFamily: 'inherit',
            fontSize: { xs: '2rem', md: '2.3rem' },
            color: '#2b2233',
          }}
        >
          Become a Seller
        </Typography>
        <Typography
          sx={{
            mb: 3,
            color: '#5b4b5c',
            fontSize: { xs: '1rem', md: '1.15rem' },
            fontFamily: 'inherit',
          }}
        >
          Join our marketplace and reach millions of beauty enthusiasts.<br />
          Grow your business with our powerful selling tools and support.
        </Typography>
        <List sx={{ mb: 3 }}>
          {benefits.map((b) => (
            <ListItem key={b} disableGutters sx={{ pb: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckCircleIcon sx={{ color: '#E90064', fontSize: 22 }} />
              </ListItemIcon>
              <Typography sx={{ color: '#2b2233', fontSize: '1rem' }}>{b}</Typography>
            </ListItem>
          ))}
        </List>
        <Button
          variant="contained"
          sx={{
            background: '#E90064',
            color: '#fff',
            px: 5,
            py: 1.5,
            borderRadius: 8,
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: 'none',
            textTransform: 'none',
            '&:hover': { background: '#c80055' },
          }}
        >
          Start Selling
        </Button>
      </Grid>
      {/* Right Column (Image) */}
      <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, mt: { xs: 4, md: 0 } }}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80"
          alt="Become a Seller"
          sx={{
            width: { xs: '100%', md: 430 },
            height: { xs: 260, md: 370 },
            borderRadius: 4,
            boxShadow: '0 8px 32px rgba(233,0,100,0.10)',
            objectFit: 'cover',
          }}
        />
      </Grid>
    </Grid>
  </Box>
);

export default ShopBecomeSellerSection;
