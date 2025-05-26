'use client'
import React, { useCallback, useEffect } from 'react';
import { Box, Typography, Stack, Paper } from '@mui/material';
import Iconify from '@/components/iconify';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCategories } from '@/redux/slices/CategoriesSlice';

const icons = [
  <Iconify icon="mdi:flower-lotus" width="24" height="24" />,
  <Iconify icon="akar-icons:question" width="24" height="24" />,
  <Iconify icon="solar:perfume-bold" width="24" height="24" />,
  <Iconify icon="fa6-solid:bottle-droplet" width="320" height="512" />,
  <Iconify icon="fa6-solid:hand-sparkles" width="640" height="512" />,
  <Iconify icon="fa-solid:gifts" width="640" height="512" />,
];

const ShopCategorySection = () =>{ 

  const {categories} = useAppSelector(state => state.CategoriesSlice)
  const dispatch = useAppDispatch()
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

    useEffect(()=> {
      dispatch(fetchCategories())
    }, [dispatch])

    console.log(categories);
    
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
  {categories?.length > 0 ? categories?.map((cat, i) => (
    <Box key={cat.categoryName} flex={1} minWidth={0.22 }>
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
        onClick={() => {
          gitUrl(cat.categoryName)
        }}
      >
        <Box mb={1} fontSize={32} color="primary.main">
        <img src={cat.categoryImage.url} alt={cat.categoryName} width={60} height={40}
          style={{
            borderRadius: 4
          }}
        />

        </Box>
        <Typography
          sx={{
            fontWeight: 600,
            fontSize: 12,
          }}
        >{cat.categoryName}</Typography>
      </Paper>
    </Box>
  )) : (
    <Typography variant="h6" sx={{ color: 'text.secondary' }}>
      No categories found
    </Typography>
  )}
</Stack>
  </Box>
)};

export default ShopCategorySection;
