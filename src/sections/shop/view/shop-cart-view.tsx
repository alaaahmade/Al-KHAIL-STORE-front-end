/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  IconButton,
  Divider,
  TextField,
  Chip,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useAuthContext } from '@/auth/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCart } from '@/redux/slices/cartSlice';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';
import { fCurrency } from '@/utils/format-number';
import { useRouter } from 'next/navigation';

const initialCart = [
  {
    id: 1,
    name: "Luxury Face Cream",
    subtitle: "Advanced anti-aging formula",
    price: 89.99,
    image: "/pdf-task/img1.jpeg",
    quantity: 1,
  },
  {
    id: 2,
    name: "Matte Lipstick",
    subtitle: "Long-lasting color",
    price: 49.98,
    image: "/pdf-task/img2.jpeg",
    quantity: 2,
  },
  {
    id: 3,
    name: "Signature Perfume",
    subtitle: "Elegant floral scent",
    price: 129.99,
    image: "/pdf-task/img3.jpeg",
    quantity: 1,
  },
];



export default function ShopCartView() {
  const {user} = useAuthContext()
  const [recommended, setRecommended] = useState<{
    productName: string;
    productDescription: string;
    standardPrice: string
    id: string;
    productImage: string;
  } | null>(null);
  const {cart} = useAppSelector(state => state.cartSlice)
  const dispatch = useAppDispatch()
  
  const [carts, setCart] = useState(initialCart);
  const [promo, setPromo] = useState("");

  const shipping = 9.99;
  const tax = 27.0;
  const total = +cart?.total + shipping + tax;

  useEffect(() => {
    if(user?.cart?.id){
      dispatch(fetchCart(user.cart.id))
    }
  }, [user, dispatch])

  const addToCart = async(productId: string, standardPrice: string) => {
    try {
       await axiosInstance.post(`/v1/carts/${user?.cart?.id}/items`, {
        productId,
        quantity: 1,
        price: standardPrice,
      })
      dispatch(fetchCart(user?.cart.id))
      toast.success('Product added to cart')
    } catch (error) {
      console.log(error);
      
      toast.error(error.message)
    }
  }
  const router = useRouter()

  const handleCheckout = async() => {
    if(cart.items.length === 0) {
      toast.error('Cart is empty')
      return
    }
    router.push('/checkout/details')
  }

  const deleteCartItem = async(itemId: string) => {
    try {
      await axiosInstance.delete(`/v1/carts/${user?.cart?.id}/items/${itemId}`)
      dispatch(fetchCart(user?.cart.id))
      toast.success('Product removed from cart')
    } catch (error) {
      console.log(error);
      
      toast.error(error.message)
    }
  }

  const updateQuantity = async(item: any) => {
    try {
      if(item.quantity <= 1) {
        deleteCartItem(item.id)
        return
      }
      await axiosInstance.patch(`/v1/carts/${user?.cart?.id}/items/${item.id}`, {
        ...item,
        quantity: +item.quantity - 1
      })
      dispatch(fetchCart(user?.cart.id))
      toast.success('Product quantity updated')
    } catch (error) {
      console.log(error);
      
      toast.error(error.message)
    }
  }

  useEffect(() => { 
    async function getRecommended() {
      try {
        const response = await axiosInstance.get('/v1/products')
        setRecommended(response.data.data.products[0]);
      } catch (error) {
        console.log(error);
        toast.error(error.message)
        
      }
    }
    getRecommended()
  }, [cart])

  return (
    <Box sx={{ background: "#f7f8fa", minHeight: "100vh", py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="flex-start">
          {/* Left: Cart */}
          <Box flex={2}>
            <Typography variant="h5" sx={{ mb: 2, fontFamily: 'serif', fontWeight: 500 }}>Shopping Cart</Typography>
            <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
              {Array.isArray(cart?.items) && cart?.items?.length > 0 ? (
                cart?.items?.map((item: any, idx: number) => (
                  <Box key={item.id} sx={{ display: "flex", alignItems: "center", mb: idx !== carts.length - 1 ? 2 : 0 }}>
                    <img
                      src={item.product.productImage}
                      alt={item.product.productName}
                      style={{ width: 56, height: 56, borderRadius: 8, objectFit: "cover", marginRight: 16 }}
                    />
                    <Box flex={1} minWidth={0}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, fontFamily: 'serif' }}>{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.product.productDescription}</Typography>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                        <IconButton
                          onClick={() => updateQuantity(item)}
                        size="small" >
                          <Icon icon="ic:round-remove" />
                        </IconButton>
                        <Typography variant="body2" sx={{ width: 20, textAlign: "center" }}>{item.quantity}</Typography>
                        <IconButton size="small" onClick={() => addToCart(item.product.id, item.product.standardPrice)}>
                          <Icon icon="ic:round-add" />
                        </IconButton>
                      </Stack>
                    </Box>
                    <Typography sx={{ minWidth: 64, textAlign: "right", fontWeight: 500 }}>${(+item?.product?.standardPrice)?.toFixed(2)}</Typography>
                    <IconButton onClick={() => deleteCartItem(item.id)}>
                      <Icon icon="ic:round-delete" color="#888" />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center" }}>
                  Your cart is empty
                </Typography>
              )
                }
            </Paper>
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: "right", mb: 2 }}>
              {cart?.items?.length} Items
            </Typography>
            {/* You May Also Like */}
            {recommended && 
              <>
              <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 1 }}>You May Also Like</Typography>
              <Stack spacing={1} direction={'column'} alignItems={'flex-start'} justifyContent={'flex-start'}
                sx={{
                  borderRadius: 2,
                  boxShadow: '1px 1px 10px rgba(0,0,0,0.08)',
                  width: '12em',
                  p: 1
                }}
              >
                <img
                  src={recommended.productImage}
                  alt={recommended.productName}
                  style={{
                    width: '100%',
                    height: '8em',
                    borderRadius: 4,
                  }}
                  />
                  <Typography
                  sx={{
                    fontSize: '0.8em',
                  }}
                  >
                    {recommended.productName}
                  </Typography>
                  <Typography
                    sx={{
                      maxWidth: '90%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontSize: '0.8em',
 
                    }}
                  >
                    {recommended.productDescription}
                  </Typography>

                  <Stack sx={{width: '100%'}} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
                    <Typography
                      sx={{
                        fontSize: '0.8em',
                      }}
                    >
                      ${recommended?.standardPrice}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => addToCart(recommended.id, recommended.standardPrice)}
                    >
                      Add to Cart
                    </Button>
                  </Stack>
              </Stack>
            </>
            }
          </Box>
          {/* Right: Order Summary */}
          <Box flex={1}>
            <Paper sx={{ p: 3, borderRadius: 3, minWidth: 320 }}>
              <Typography variant="h6" sx={{ fontFamily: 'serif', mb: 2 }}>Order Summary</Typography>
              <Stack spacing={1} mb={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">{fCurrency((+cart?.total))}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">${shipping.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Tax</Typography>
                  <Typography variant="body2">${tax.toFixed(2)}</Typography>
                </Stack>
              </Stack>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>Total</Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>${total.toFixed(2)}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Promo code"
                  value={promo}
                  onChange={e => setPromo(e.target.value)}
                  sx={{ flex: 1, background: '#fafafa', borderRadius: 2 }}
                  InputProps={{ sx: { borderRadius: 2, fontFamily: 'serif' } }}
                />
                <Button variant="contained" sx={{ bgcolor: '#E91E63', color: '#fff', borderRadius: 2, px: 3, fontWeight: 600, fontFamily: 'serif', textTransform: 'none' }}>Apply</Button>
              </Stack>
              <Button
                onClick={handleCheckout}
                variant="contained"
                sx={{ bgcolor: '#E91E63', color: '#fff', borderRadius: 2, fontWeight: 600, fontFamily: 'serif', textTransform: 'none', fontSize: 16, py: 1.2 }}
                fullWidth
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
