import React, { useEffect } from 'react';
import { useCheckoutContext } from '@/auth/context/checkout-context';
import {
  Box, Paper, Typography, Stack, Stepper, Step, StepLabel, TextField, Button, Divider, Radio, RadioGroup, FormControlLabel, Avatar
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useAuthContext } from '@/auth/hooks';
import { fetchCart } from '@/redux/slices/cartSlice';
import { fCurrency } from '@/utils/format-number';

export default function CheckoutDetailsView() {
  const { shipping, setShipping, payment, setPayment, setCart } = useCheckoutContext();
  const {user} = useAuthContext()
  const {cart} = useAppSelector(state => state.cartSlice)
  const dispatch = useAppDispatch()

  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = React.useState('card');

  const shippingFee = 5.99;

  const handleOnclick = async () => {
    router.push('/checkout/review');
  };

  useEffect(() => {
    dispatch(fetchCart(user?.cart?.id))
  }, [dispatch, user])

  useEffect(() => {
    if( cart?.items?.length > 0 ){
      setCart(cart)
    }
  }, [cart, setCart])
  

  return (
    <Box sx={{ background: '#f7f8fa', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', px: 2, width: '100%' }}>
        {/* Stepper */}
        <Stack direction="column" alignItems="flex-start" justifyContent={'center'} spacing={2} sx={{ mb: 3, width: '50%', }}>
        <Typography mb={2} variant='h6'>Checkout</Typography>
          <Stepper activeStep={1} alternativeLabel sx={{ flex: 1, width: '100%', m: 0 }}>
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
          {/* Left: Forms */}
          <Box flex={2}>
            {/* Shipping Information */}
            <Paper sx={{ mb: 3, p: 3, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontFamily: 'serif', fontWeight: 500, mb: 2 }}>Shipping Information</Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
                <TextField
                  label="First Name"
                  fullWidth
                  size="small"
                  value={shipping.firstName}
                  onChange={e => setShipping({ ...shipping, firstName: e.target.value })}
                  sx={{ fontFamily: 'serif' }}
                />
                <TextField
                  label="Last Name"
                  fullWidth
                  size="small"
                  value={shipping.lastName}
                  onChange={e => setShipping({ ...shipping, lastName: e.target.value })}
                  sx={{ fontFamily: 'serif' }}
                />
              </Stack>
              <TextField
                label="Address"
                fullWidth
                size="small"
                value={shipping.address}
                onChange={e => setShipping({ ...shipping, address: e.target.value })}
                sx={{ mb: 2, fontFamily: 'serif' }}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="City"
                  fullWidth
                  size="small"
                  value={shipping.city}
                  onChange={e => setShipping({ ...shipping, city: e.target.value })}
                  sx={{ fontFamily: 'serif' }}
                />
                <TextField
                  label="Postal Code"
                  fullWidth
                  size="small"
                  value={shipping.postalCode}
                  onChange={e => setShipping({ ...shipping, postalCode: e.target.value })}
                  sx={{ fontFamily: 'serif' }}
                />
              </Stack>
            </Paper>
            {/* Payment Method */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="subtitle1" sx={{ fontFamily: 'serif', fontWeight: 500, mb: 2 }}>Payment Method</Typography>
              <RadioGroup
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                sx={{ mb: 2 }}
              >
                <FormControlLabel
                  value="card"
                  control={<Radio checked={paymentMethod === 'card'} />}
                  label={<>
                    <CreditCardIcon sx={{ mr: 1, fontSize: 18 }} />
                    Credit/Debit Card
                  </>}
                />
              </RadioGroup>
              <TextField
                label="Card Number"
                fullWidth
                size="small"
                value={payment.cardNumber}
                onChange={e => setPayment({ ...payment, cardNumber: e.target.value })}
                sx={{ mb: 2, fontFamily: 'serif' }}
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Expiry Date"
                  placeholder="MM/YY"
                  fullWidth
                  size="small"
                  value={payment.expiry}
                  onChange={e => setPayment({ ...payment, expiry: e.target.value })}
                  sx={{ fontFamily: 'serif' }}
                />
                <TextField
                  label="CVV"
                  placeholder="123"
                  fullWidth
                  size="small"
                  value={payment.cvv}
                  onChange={e => setPayment({ ...payment, cvv: e.target.value })}
                  sx={{ fontFamily: 'serif' }}
                />
              </Stack>
            </Paper>
          </Box>
          {/* Right: Order Summary */}
          <Box flex={1}>
            <Paper sx={{ p: 3, borderRadius: 3, minWidth: 320 }}>
              <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 2 }}>Order Summary</Typography>
              <Stack spacing={2} mb={2}>
                {cart?.items?.length>0 && cart?.items?.map((item, idx) => (
                  <Stack key={idx} direction="row" spacing={2} alignItems="center">
                    <Avatar src={item?.product?.productImage} alt={item?.product?.productName} variant="rounded" sx={{ width: 48, height: 48 }} />
                    <Box>
                      <Typography sx={{ fontSize: '0.95em', fontFamily: 'serif' }}>{item?.product?.productName}</Typography>
                      <Typography sx={{ fontSize: '0.8em', color: 'text.secondary' }}>Quantity: {item.quantity}</Typography>
                    </Box>
                    <Box flex={1} />
                    <Typography sx={{ fontSize: '0.95em', fontFamily: 'serif' }}>{fCurrency(+item.product?.standardPrice)}</Typography>
                  </Stack>
                ))}
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack spacing={1} mb={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">{fCurrency(cart?.total)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">{fCurrency(+shippingFee * cart?.items?.length)}</Typography>
                </Stack>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>{fCurrency(+cart?.total + (+shippingFee * cart?.items?.length))}</Typography>
              </Stack>
              <Button
                onClick={handleOnclick}
                variant="contained"
                sx={{ bgcolor: '#E91E63', color: '#fff', borderRadius: 2, fontWeight: 600, fontFamily: 'serif', textTransform: 'none', fontSize: 16, py: 1.2 }}
                fullWidth
              >
                Place Order
              </Button>
            </Paper>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
