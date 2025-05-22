'use client'
import React, { useCallback } from 'react';
import { Box, Typography, Stack, Paper } from '@mui/material';
import Iconify from '@/components/iconify';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

const categories = [
  { label: 'Skincare', icon: <Iconify icon="mdi:flower-lotus" width="24" height="24" /> },
  { label: 'Makeup', icon: <Iconify icon="akar-icons:question" width="24" height="24" /> },
  { label: 'Haircare', icon: <Iconify icon="solar:perfume-bold" width="24" height="24" /> },
  { label: 'Fragrances', icon: <Iconify icon="fa6-solid:bottle-droplet" width="320" height="512" /> },
  { label: 'Body Care', icon: <Iconify icon="fa6-solid:hand-sparkles" width="640" height="512" /> },
  { label: 'Gift Sets', icon: <Iconify icon="fa-solid:gifts" width="640" height="512" /> },
];

const ShopCategorySection = () =>{ 

  const searchParams = useSearchParams()
  const router = useRouter()

  const gitUrl = useCallback(
      (newValue: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('category', newValue);
        router.push(`products?${params.toString()}`);
      },
      [searchParams, router]
    );
  return(
  <Box sx={{
    background: '#fff',
    px: { xs: 2, md: 0 },
    py: { xs: 4, md: 2 },
    mt: 2,
   }}>
    <Typography variant="h5" fontWeight={600} mb={3} align="left">
      Shop by Category
    </Typography>
    <Stack direction="row"
      sx={{
        px: { xs: 2, md: 23 },
        py: { xs: 4, md: 2 },
        maxWidth: '1200px',
        mx: 'auto',
      }}
    justifyContent="center" alignItems="center" spacing={3} width="100%">
  {categories.map((cat) => (
    <Box key={cat.label} flex={1} minWidth={0.22 }>
      <Paper
        elevation={2}
        sx={{
          px: 4,
          py: 2,
          textAlign: 'center',
          borderRadius: 2,
          bgcolor: 'rgba(253, 242, 248, 1)',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
        }}
        // component={Link}
        // href={getUrl(cat.label)}
        onClick={() => {
          gitUrl(cat.label)
        }}
      >
        <Box mb={1} fontSize={32} color="primary.main">{cat.icon}</Box>
        <Typography>{cat.label}</Typography>
      </Paper>
    </Box>
  ))}
</Stack>
  </Box>
)};

export default ShopCategorySection;
