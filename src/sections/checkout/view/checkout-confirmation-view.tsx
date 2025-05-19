'use client';
import React, { useEffect } from 'react';
import { useCheckoutContext } from '@/auth/context/checkout-context';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  Box, Paper, Typography, Stack, Divider, Avatar, Button
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axiosInstance from '@/utils/axios';
import { useAuthContext } from '@/auth/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchOrder } from '@/redux/slices/cartSlice';
import { fCurrency } from '@/utils/format-number';

// Use context and cart/order data instead of hardcoded

export default function CheckoutConfirmationView() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const estimatedDelivery = 'TBD';
  const { shipping, payment } = useCheckoutContext();
  const { cart, order } = useAppSelector(state => state.cartSlice);
  const {user} = useAuthContext()
  const shippingFee = 9.99;
  const tax = 27.0;
  const router = useRouter();
  
  
  useEffect(() => {
    async function emptyCart() {
      if(user?.cart?.id){
        await axiosInstance.delete(`/v1/carts/${user?.cart?.id}/items`);
      }
    }
    emptyCart();
  }, [user, cart]);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (sessionId) {
      dispatch(fetchOrder(sessionId));
    }
    
  }, [searchParams, dispatch]);

  useEffect(() => {
    if(order?.cart?.items?.length < 1){
      router.push('/')
    }
  }, [order, dispatch, router]);
  
  return (
    <Box sx={{ background: '#f7f8fa', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', px: 2 }}>
        {/* Success Message */}
        <Stack alignItems="center" spacing={2} mb={4}>
          <CheckCircleOutlineIcon sx={{ fontSize: 64, color: 'success.main', mb: 1 }} />
          <Typography variant="h4" sx={{ fontFamily: 'serif', fontWeight: 600 }}>Order Confirmed!</Typography>
          <Typography sx={{ fontFamily: 'serif', color: 'text.secondary', textAlign: 'center' }}>
            Thank you for your purchase. Your order has been successfully placed.
          </Typography>
        </Stack>
        {/* Order Number & Delivery */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" mb={4}>
          <Paper sx={{ p: 2, borderRadius: 2, minWidth: 220, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.95em', color: 'text.secondary', fontFamily: 'serif' }}>Order Number</Typography>
            <Typography sx={{ fontWeight: 600, fontFamily: 'serif' }}>{order?.orderNumber}</Typography>
          </Paper>
          <Paper sx={{ p: 2, borderRadius: 2, minWidth: 220, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.95em', color: 'text.secondary', fontFamily: 'serif' }}>Estimated Delivery</Typography>
            <Typography sx={{ fontWeight: 600, fontFamily: 'serif' }}>{estimatedDelivery}</Typography>
          </Paper>
        </Stack>
        {/* Order Details */}
        <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 2 }}>Order Details</Typography>
          <Stack spacing={2} mb={2}>
            {order?.cart?.items?.length > 0 &&  order?.cart?.items?.map((item: any, idx: number) => (
              <Stack key={idx} direction="row" spacing={2} alignItems="center">
                <Avatar src={item.product?.productImage} alt={item.product?.productName} variant="rounded" sx={{ width: 48, height: 48 }} />
                <Box>
                  <Typography sx={{ fontSize: '0.95em', fontFamily: 'serif' }}>{item.product?.productName}</Typography>
                  <Typography sx={{ fontSize: '0.8em', color: 'text.secondary', fontFamily: 'serif' }}>Quantity: {item.quantity}</Typography>
                </Box>
                <Box flex={1} />
                <Typography sx={{ fontSize: '0.95em', fontFamily: 'serif' }}>{fCurrency(item.product?.standardPrice)}</Typography>
              </Stack>
            ))}
          </Stack>
          {/* Order Summary */}
          <Paper sx={{ p: 2, borderRadius: 2, background: '#fafafa', mb: 2 }}>
            <Stack spacing={1}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">{fCurrency(order?.cart.total)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Shipping</Typography>
                <Typography variant="body2">${shippingFee.toFixed(2)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2">${tax.toFixed(2)}</Typography>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body1" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{fCurrency((+order?.cart?.total || 1) + (+tax || 1) + ((+shippingFee || 1) * order?.cart?.items?.length || 1))}</Typography>
              </Stack>
            </Stack>
          </Paper>
          {/* Shipping & Payment Info */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontFamily: 'serif', mb: 1 }}>Shipping Address</Typography>
<Typography sx={{ fontFamily: 'serif' }}>{shipping.firstName} {shipping.lastName}</Typography>
<Typography sx={{ fontFamily: 'serif' }}>{shipping.address}</Typography>
<Typography sx={{ fontFamily: 'serif' }}>{shipping.city}</Typography>
<Typography sx={{ fontFamily: 'serif' }}>{shipping.postalCode}</Typography>
            </Paper>
            <Paper sx={{ p: 2, borderRadius: 2, flex: 1 }}>
              <Typography sx={{ fontWeight: 500, fontFamily: 'serif', mb: 1 }}>Payment Method</Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar src="/visa.svg" alt="Visa" sx={{ width: 32, height: 20 }} />
                <Typography sx={{ fontFamily: 'serif', fontSize: '0.95em' }}>Visa ending in {payment.cardNumber.slice(-4)}</Typography>
</Stack>
<Typography sx={{ fontFamily: 'serif', fontSize: '0.95em', mt: 0.5 }}>Expiring {payment.expiry}</Typography>
            </Paper>
          </Stack>
        </Paper>
        {/* Action Buttons */}
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4} justifyContent="center">
          <Button variant="contained" sx={{ bgcolor: '#E91E63', color: '#fff', borderRadius: 2, fontWeight: 600, fontFamily: 'serif', textTransform: 'none', fontSize: 16, px: 4 }}>
            Track Order
          </Button>
          <Button variant="outlined" sx={{ borderColor: '#E91E63', color: '#E91E63', borderRadius: 2, fontWeight: 600, fontFamily: 'serif', textTransform: 'none', fontSize: 16, px: 4 }}>
            Continue Shopping
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
