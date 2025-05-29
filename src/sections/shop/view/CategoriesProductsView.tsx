'use client';
import { LoadingScreen } from '@/components/loading-screen';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCategoriesProducts, fetchFeaturedProducts } from '@/redux/slices/SellersSlice';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import { ProductCard } from '../productCard';
import { useRouter, useSearchParams } from 'next/navigation';
import Iconify from '@/components/iconify';
const CategoriesProductsView = () => {
  const { categoriesProducts, loadingB } = useAppSelector((state) => state.SellersSlice);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const gitUrl = useCallback(
    (newValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('category', newValue);
      router.push(`/shop/products?${params.toString()}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchCategoriesProducts());
  }, [dispatch]);

  // Reset to page 1 when filters change
  if (loadingB) return <LoadingScreen />;

  return (
    <Container sx={{ px: 8, py: 1 }}>
      <Typography variant="h4" sx={{ my: 5 }}>
        Categories
      </Typography>
      {categoriesProducts?.length > 0 &&
        categoriesProducts.map((cat) => (
          <Stack key={cat.id} sx={{ my: 8 }}>
            <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
              <Typography mb={4} variant="h6">
                {cat.categoryName}
              </Typography>
              <Button
                color="primary"
                endIcon={<Iconify icon="eva:arrow-fill" width="24" height="24" />}
                onClick={() => gitUrl(cat.categoryName)}
              >
                See More
              </Button>
            </Stack>
            <Box
              gap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(4, 1fr)',
              }}
            >
              {cat?.products?.length > 0 ? (
                cat?.products
                  ?.slice(0, 4)
                  .map((product: any) => <ProductCard key={product.id} product={product} />)
              ) : (
                <Typography width={'100%'} textAlign={'center'}>
                  There is no Products found
                </Typography>
              )}
            </Box>
          </Stack>
        ))}
    </Container>
  );
};

export default CategoriesProductsView;
