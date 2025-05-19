'use client'
import React from 'react';
import { Box, Button, Typography, Avatar, Rating, Chip, Stack, Paper } from '@mui/material';
import Label from '@/components/label';
import { Icon } from '@iconify/react';
import { ProductImageGallery } from '../productImageGallery';
import { ProductTabs } from '../product-taps';
import axiosInstance from '@/utils/axios';
import { useAuthContext } from '@/auth/hooks';
import { toast } from 'react-toastify';

const mockProduct = {
  id: 1,
  title: 'Luxury Face Cream',
  price: 89.99,
  standardPrice: 99.99,
  isOnSale: true,
  description: 'Advanced anti-aging formula enriched with premium ingredients for youthful, radiant skin. Clinically proven to reduce fine lines and wrinkles.',
  highlights: ['Reduces fine lines and wrinkles', 'Improves skin elasticity', 'Enhances skin resilience'],
  seller: {
    name: 'Beauty Labs',
    rating: 4.6,
    reviews: 467,
    avatar: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg?semt=ais_hybrid&w=740',
    shopLink: '#',
  },
  totalRating: 4.3,
  mainImage: 'https://thumbs.dreamstime.com/b/pink-flowers-float-clear-waters-hawaii-soft-white-sand-below-347952870.jpg',
  images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTixMUT-tvYkn-4K0khhYC3lKHV_mRmBGpc0g&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIod4kE9WxLPhpki-0oPMeumyS8DzwkFe3-g&s',
    'https://i.pinimg.com/236x/14/86/86/148686b4a830e06d8089db5cb1e521f4.jpg',
    'https://thumbs.dreamstime.com/b/pink-flowers-float-clear-waters-hawaii-soft-white-sand-below-347952870.jpg'],
  stock: 12,
  tabs: {
    Description: 'Experience the ultimate in luxury skincare with our advanced anti-aging face cream. This premium formula combines powerful active ingredients with cutting-edge technology to deliver visible results.',
    Ingredients: 'Water, Glycerin, Cetearyl Alcohol, Shea Butter, Niacinamide, Hyaluronic Acid, Vitamin E, Peptides, Fragrance.',
    'How to Use': 'Apply a small amount to cleansed face and neck morning and night. Massage gently until fully absorbed.',
    Reviews: [],
  },
  reviewSummary: {
    average: 4.8,
    total: 217,
    breakdown: [
      { stars: 5, percent: 68 },
      { stars: 4, percent: 26 },
      { stars: 3, percent: 4 },
      { stars: 2, percent: 1 },
      { stars: 1, percent: 1 },
    ],
    highlights: [
      { label: 'Great texture', count: 31 },
      { label: 'Fast absorption', count: 28 },
      { label: 'Worth the price', count: 12 },
      { label: 'Visible results', count: 21 },
      { label: 'Gentle on skin', count: 19 },
    ],
  },

 Reviews: [
  {
    user: 'Sarah Johnson',
    avatar: '/mock/user1.png',
    rating: 5,
    text: "This cream is absolutely amazing! I've been using it for a month and have noticed significant improvement in my skin's texture and firmness. The price is justified by the quality.",
    date: '2 days ago',
    helpful: 14,
    reply: {
      user: 'Beauty Labs',
      avatar: '/mock/seller-avatar.png',
      text: "Thank you for your wonderful review, Sarah! We're so glad you're enjoying the results.",
      date: '1 day ago',
    },
  },
  {
    user: 'Emma Wilson',
    avatar: '/mock/user2.png',
    rating: 4,
    text: 'The cream has a lovely texture and absorbs well. I’ve seen some improvement but was expecting more dramatic results given the price point.',
    date: '1 week ago',
    helpful: 12,
  },
]
};



function ProductInfo({ product }: { product: typeof mockProduct }) {

  const { user } = useAuthContext();

  const addToCart = async(productId: string) => {
    try {
      const response = await axiosInstance.post(`/v1/carts/${user?.cart?.id}/items`, {
        productId,
        quantity: 1,
        price: product.standardPrice,
      })
      toast.success('Product added to cart')
    } catch (error) {
      console.log(error);
      
      toast.error(error.message)
    }
  }
  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} justifyContent={'space-between'}>
      <Label
          variant="soft"
          color={
            'primary'
          }
        >
          Skincare
        </Label>
        <Stack direction="row" spacing={1} alignItems="center"> 
        <Rating value={product.totalRating} readOnly precision={0.5} size="small" sx={{ color: '#FFD700' }} />
        <Typography>{`(${product.totalRating})`}</Typography>
        </Stack>
      </Stack>
      <Typography color="#000" variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
        {product.title}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
          ${product.price}
        </Typography>
      </Stack>
      <Typography variant="body2" sx={{ mt: 2, color: '#666' }}>
        {product.description}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
        <Chip sx={{
          bgcolor: 'transparent',
          color: '#000',
        }}  icon={<Icon color='#10b981' icon="uis:check" width="20" height="20" />} label="Dermatologist tested" size="small" />
        <Chip sx={{
          bgcolor: 'transparent',
          color: '#000',
        }}  icon={<Icon color='#10b981'  icon="uis:check" width="20" height="20" />} label="Cruelty free" size="small" />
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
        <Avatar src={product.seller.avatar} />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>{`Sold by ${product.seller.name}`}</Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Icon color="#FFD700" icon="mdi:star" width="20" height="20" />
            <Typography variant="caption" color="text.secondary">
              {product.seller.rating}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              (Seller Ratings)
            </Typography>
            <Button color='primary' href={product.seller.shopLink} size="small" sx={{ ml: 1 }}>
              Visit Store
            </Button>
          </Stack>
        </Box>
      </Stack>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mt: 2 }}>
        <Button
          onClick={() => addToCart(String(product?.id))}
        variant="contained" color="primary" sx={{ borderRadius: 8, px: 5, color: '#fff' }}>
          Add to Cart
        </Button>
        <Button variant="outlined" color="primary" sx={{ borderRadius: 8, px: 5 }}>
          Buy Now
        </Button>
        <Typography variant="caption" color="text.secondary">
          {product.stock} items left
        </Typography>
      </Stack>
    </Box>
  );
}




export default function ShopProductView() {

  return (
    <Box sx={{ background: '#f7f8fa', minHeight: '100vh', py: 0 }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto', background: '#fff', borderRadius: 4, p: 1}}>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
          Home &gt; Skincare &gt; Luxury Face Cream
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <ProductImageGallery images={mockProduct.images} mainImage={mockProduct.mainImage} />
          <ProductInfo product={mockProduct} />
        </Stack>
        <ProductTabs product={mockProduct} />
      </Box>
    </Box>
  );
}
