/* eslint-disable no-unsafe-optional-chaining */
'use client';
import React, { useEffect } from 'react';
import { Box, Button, Typography, Avatar, Rating, Chip, Stack } from '@mui/material';
import Label from '@/components/label';
import { Icon } from '@iconify/react';
import { ProductImageGallery } from '../productImageGallery';
import { ProductTabs } from '../product-taps';
import axiosInstance from '@/utils/axios';
import { useAuthContext } from '@/auth/hooks';
import { toast } from 'react-toastify';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchServiceById } from '@/redux/slices/serviceSlice';
import { LoadingScreen } from '@/components/loading-screen';

const taps = {
  Description:
    'Experience the ultimate in luxury skincare with our advanced anti-aging face cream. This premium formula combines powerful active ingredients with cutting-edge technology to deliver visible results.',
  Ingredients:
    'Water, Glycerin, Cetearyl Alcohol, Shea Butter, Niacinamide, Hyaluronic Acid, Vitamin E, Peptides, Fragrance.',
  'How to Use':
    'Apply a small amount to cleansed face and neck morning and night. Massage gently until fully absorbed.',
  Reviews: [],
};

function ProductInfo({ product }: { product: any }) {
  const { user } = useAuthContext();

  const addToCart = async (productId: string) => {
    try {
      await axiosInstance.post(`/v1/carts/${user?.cart?.id}/items`, {
        productId,
        quantity: 1,
        price: product.standardPrice,
      });
      toast.success('Product added to cart');
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} justifyContent={'space-between'}>
        <Label variant="soft" color={'primary'}>
          {product?.category?.[0]?.categoryName || 'Category'}
        </Label>
        <Stack direction="row" spacing={1} alignItems="center">
          <Rating
            value={
              product?.comments?.length > 0
                ? product.comments.reduce((sum: number, r: any) => sum + r.rating, 0) /
                  product.comments.length
                : 0
            }
            readOnly
            precision={0.5}
            size="small"
            sx={{ color: '#FFD700' }}
          />
          <Typography>{`(${product?.comments?.length > 0 ? (product.comments.reduce((sum: number, r: any) => sum + r.rating, 0) / product.comments.length).toFixed(1) : 0})`}</Typography>
        </Stack>
      </Stack>
      <Typography color="#000" variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
        {product?.productName}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
          ${product?.offerPrice || product?.standardPrice}
        </Typography>
        {product?.offerPrice && product?.offerPrice !== product?.standardPrice && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ textDecoration: 'line-through' }}
          >
            ${product?.standardPrice}
          </Typography>
        )}
      </Stack>
      <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
        {product?.productDescription}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Chip
          sx={{
            bgcolor: 'transparent',
            color: '#000',
          }}
          icon={<Icon color="#10b981" icon="uis:check" width="20" height="20" />}
          label="Dermatologist tested"
          size="small"
        />
        <Chip
          sx={{
            bgcolor: 'transparent',
            color: '#000',
          }}
          icon={<Icon color="#10b981" icon="uis:check" width="20" height="20" />}
          label="Cruelty free"
          size="small"
        />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
        <Avatar src={product?.store?.logo} />
        <Box>
          <Typography
            variant="body2"
            sx={{ fontWeight: 700 }}
          >{`Sold by ${product?.store?.name}`}</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon color="#FFD700" icon="mdi:star" width="20" height="20" />
            <Typography variant="caption" color="text.secondary">
              {/* You may calculate/store rating for the store if available */}
              {product?.store?.seller?.user?.firstName
                ? product.store.seller.user.firstName
                : 'Seller'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              (Seller)
            </Typography>
            <Button
              color="primary"
              href={product?.store?.id ? `/shop/shops/${product.store.id}` : '#'}
              size="small"
              sx={{ ml: 1 }}
            >
              Visit Store
            </Button>
          </Stack>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
        <Button
          onClick={() => addToCart(String(product?.id))}
          variant="contained"
          color="primary"
          sx={{ borderRadius: 8, px: 5, color: '#fff' }}
        >
          Add to Cart
        </Button>
        <Button variant="outlined" color="primary" sx={{ borderRadius: 8, px: 5 }}>
          Buy Now
        </Button>
        <Typography variant="caption" color="text.secondary">
          {product?.productQuantity} items left
        </Typography>
      </Stack>
    </Box>
  );
}

export default function ShopProductView() {
  const { productId } = useParams();
  const { currentProduct, loading } = useAppSelector((state) => state.serviceSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchServiceById(productId));
  }, [dispatch, productId]);

  if (loading) return <LoadingScreen />;
  if (!currentProduct)
    return (
      <Typography variant="h6" sx={{ textAlign: 'center', mt: 8 }}>
        Product Not Found
      </Typography>
    );

  return (
    <Box sx={{ background: '#f7f8fa', minHeight: '100vh', py: 0 }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', background: '#fff', borderRadius: 4, p: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Home &gt; {currentProduct?.category?.[0]?.categoryName || 'Category'} &gt;{' '}
          {currentProduct?.productName}
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <ProductImageGallery
            images={[...currentProduct?.productGallery, currentProduct?.productImage] || []}
            mainImage={currentProduct?.productImage}
          />
          <ProductInfo product={currentProduct} />
        </Stack>
        {currentProduct && <ProductTabs product={{ ...currentProduct, tabs: taps }} />}
      </Box>
    </Box>
  );
}
