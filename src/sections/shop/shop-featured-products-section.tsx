'use client'
import React, { useEffect } from 'react';
import { Box, Typography, Grid, Button, Stack } from '@mui/material';
import { ProductCard } from './productCard';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { LoadingScreen } from '@/components/loading-screen';
import { fetchFeaturedProducts } from '@/redux/slices/SellersSlice';



const ShopFeaturedProductsSection = () => {

    const {featuredProducts, loadingB} = useAppSelector(state => state.SellersSlice)

    const dispatch = useAppDispatch()


    useEffect(() => {
      dispatch(fetchFeaturedProducts())
    }, [dispatch])

    console.log(featuredProducts);
    

    if(loadingB) return <LoadingScreen/>

  return (
  <Box sx={{
    background: '#fff',
    px: { xs: 2, md: 0 },
    py: { xs: 4, md: 2 },
    mt: 2,
   }}>
    <Stack  direction="row" justifyContent="space-between" alignItems="center" p={0} width={'100%'} mb={5}>
      <Typography variant="h5" fontWeight={600}>Featured Products</Typography>
      <Button variant="text">View All</Button>
    </Stack>
    <Box
      display="grid" 
      gap={3} 
      gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
      >

      {featuredProducts.length >  0 && featuredProducts.slice(0, 4).map((prod) => <ProductCard key={prod.id} product={prod} />)}
    </Box>
  </Box>
  )
};

export default ShopFeaturedProductsSection;
