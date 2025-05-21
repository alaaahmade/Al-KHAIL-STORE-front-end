import React from 'react';
import { useCheckoutContext } from '@/auth/context/checkout-context';
import { useAppDispatch } from '@/redux/hooks';
import axiosInstance from '@/utils/axios';
import { stripePromise } from '@/utils/stripe';
import {
  Box, Paper, Typography, Stack, Stepper, Step, StepLabel, Divider, Avatar, Button, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { redirect, useRouter } from 'next/navigation';
import { fCurrency } from '@/utils/format-number';
import { changeOrder } from '@/redux/slices/cartSlice';
import Iconify from '@/components/iconify';

// Remove hardcoded data, use context and cart

export default function CheckoutReviewView() {
  const { shipping, payment, cart } = useCheckoutContext();
  const dispatch = useAppDispatch()
  const shippingFee = 9.99;
  const tax = 27.0;

  const router = useRouter()
  

  const handleOnclick = async () => {
    try {
      const res = await axiosInstance.post(`/v1/carts/${cart.id}/checkout`, {
        shipping,
        payment,
        shippingFee,
        tax
      });
      const { sessionId } = res.data.data;
      const stripe = await stripePromise;
      
      if (stripe) {
        dispatch(changeOrder(res.data.data));
        await stripe.redirectToCheckout({ sessionId });
      } else {
        throw new Error('Stripe failed to load');
      }
    } catch (error) {
      // TODO: Show error to user
      console.error(error);
    }
  };
  

  // if(!cart || !shipping.address || !payment.cardNumber) {
  //   return redirect('/checkout/details');
  // }

  return (
    <Box sx={{ background: '#f7f8fa', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2 }}>
        {/* Stepper */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Stepper activeStep={2} alternativeLabel sx={{ flex: 1 }}>
            <Step>
              <StepLabel>Cart</StepLabel>
            </Step>
            <Step>
              <StepLabel>Details</StepLabel>
            </Step>
            <Step>
              <StepLabel>Confirmation</StepLabel>
            </Step>
          </Stepper>
        </Stack>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems="flex-start">
          {/* Left: Review Details */}
          <Box flex={2}>
            {/* Shipping Address */}
            <Paper sx={{ mb: 3, p: 3, borderRadius: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="subtitle1" sx={{ fontFamily: 'serif', fontWeight: 500, mb: 1 }}>Shipping Address</Typography>
                  <Typography sx={{ fontFamily: 'serif' }}>{shipping.firstName} {shipping.lastName}</Typography>
<Typography sx={{ fontFamily: 'serif' }}>{shipping.address}</Typography>
<Typography sx={{ fontFamily: 'serif' }}>{shipping.city}</Typography>
<Typography sx={{ fontFamily: 'serif' }}>{shipping.postalCode}</Typography>
                </Box>
                <IconButton
                  onClick={() => router.push('/checkout/details')}
                color="primary" size="small" sx={{ mt: 1 }}>
                  <EditIcon sx={{ color: '#E91E63' }} fontSize="small" />
                  <Typography sx={{ color: '#E91E63', fontSize: '0.9em', ml: 0.5, fontFamily: 'serif' }}>Edit</Typography>
                </IconButton>
              </Stack>
            </Paper>
            {/* Order Items */}
            <Paper sx={{ mb: 3, p: 3, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontFamily: 'serif', fontWeight: 500, mb: 2 }}>Order Items</Typography>
              <Stack spacing={2}>
                {cart?.items?.length > 0 && cart?.items?.map((item: any, idx: number) => (
                <Stack key={idx} direction="row" spacing={2} alignItems="center">
                  <Avatar src={item.product?.productImage} alt={item.product.productName} variant="rounded" sx={{ width: 48, height: 48 }} />
                  <Box>
                <Typography sx={{ fontSize: '0.95em', fontFamily: 'serif' }}>{item?.product.productName}</Typography>
                {item?.product?.productSubtitle && (
                  <Typography sx={{ fontSize: '0.8em', color: 'text.secondary', fontFamily: 'serif' }}>{item?.product?.productSubtitle}</Typography>
                )}
                <Typography sx={{ fontSize: '0.8em', color: 'text.secondary', fontFamily: 'serif' }}>Qty: {item.quantity}</Typography>
              </Box>
              <Box flex={1} />
              <Typography sx={{ fontSize: '0.95em', fontFamily: 'serif' }}>{fCurrency(+item?.product?.standardPrice)}</Typography>
            </Stack>
          ))}
              </Stack>
            </Paper>
            {/* Payment Method */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" sx={{ fontFamily: 'serif', fontWeight: 500 }}>Payment Method</Typography>
                <IconButton  
                  onClick={() => router.push('/checkout/details')}
                  color="primary" size="small">
                  <EditIcon sx={{ color: '#E91E63' }} fontSize="small" />
                  <Typography sx={{ color: '#E91E63', fontSize: '0.9em', ml: 0.5, fontFamily: 'serif' }}>Edit</Typography>
                </IconButton>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                <Iconify color={'#2563eb'} icon="cib:cc-visa" width={42} height={42} />
                <Typography sx={{ fontFamily: 'serif', fontSize: '0.95em' }}>**** **** **** {payment.cardNumber.slice(-4)}</Typography>
<Box flex={1} />
<Typography sx={{ fontFamily: 'serif', fontSize: '0.95em' }}>Expires {payment.expiry}</Typography>
              </Stack>
            </Paper>
          </Box>
          {/* Right: Order Summary */}
          <Box flex={1}>
            <Paper sx={{ p: 3, borderRadius: 3, minWidth: 320 }}>
              <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 2 }}>Order Summary</Typography>
              <Stack spacing={1} mb={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">{fCurrency(+cart?.total)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">{fCurrency(+shippingFee * (+cart?.items.length))}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">${tax.toFixed(2)}</Typography>
                </Stack>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{fCurrency(+cart?.total + (+shippingFee * (+cart?.items.length)) + tax)}</Typography>
              </Stack>
              <Button
              onClick={handleOnclick}
                variant="contained"
                sx={{ bgcolor: '#E91E63', color: '#fff', borderRadius: 2, fontWeight: 600, fontFamily: 'serif', textTransform: 'none', fontSize: 16, py: 1.2, mb: 2 }}
                fullWidth
              >
                Confirm Order
              </Button>
              <Typography sx={{ fontSize: '0.8em', color: 'text.secondary', textAlign: 'center', mt: 1 }}>
                By placing your order, you agree to our <span style={{ color: '#E91E63', textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span> and <span style={{ color: '#E91E63', textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
              </Typography>
            </Paper>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
