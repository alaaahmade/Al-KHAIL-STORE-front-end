import React from 'react';
import { Box, Typography, Grid, Button, Stack } from '@mui/material';
import { ProductCard } from './productCard';


const featuredProducts = [
  {
    id: '1',
    productName: 'Luxury Face Cream',
    productImage: ['https://futuremeworld.com/wp-content/uploads/2024/02/the-hydrating-gel-cream-fantasy-655x812.jpeg'],
    offerPrice: 69.99,
    standardPrice: 89.99,
    description: 'A luxurious face cream for all skin types.',
    productQuantity: '10',
    category: [{categoryName: 'Skincare', id: 's1'}],
    comments: [],
    store: {
      id: 's1',
      name: 'Beauty Hub',
      logo: 'https://example.com/store-logo.png',
    },
    hours: 2,
  },
  {
    id: '2',
    productName: 'Avista Lipstick',
    productImage: ['https://futuremeworld.com/wp-content/uploads/2024/02/the-hydrating-gel-cream-fantasy-655x812.jpeg'],
    offerPrice: 19.99,
    description: 'A luxurious face cream for all skin types.',
    standardPrice: 24.99,
    productQuantity: '25',
    category: [{categoryName: 'Makeup', id: 'm1'}],
    comments: [],
    store: {
      id: 's2',
      name: 'Glam Store',
      logo: 'https://example.com/store-logo.png',
    },
    hours: 4,
  },
  {
    id: '3',
    productName: 'Signature Revitalizer',
    productImage: ['https://futuremeworld.com/wp-content/uploads/2024/02/the-hydrating-gel-cream-fantasy-655x812.jpeg'],
    offerPrice: 99.99,
    description: 'A luxurious face cream for all skin types.',
    standardPrice: 129.99,
    productQuantity: '5',
    category: [{categoryName: 'Fragrance', id: 'f1'}],
    comments: [],
    store: {
      id: 's3',
      name: 'Fragrance World',
      logo: 'https://example.com/store-logo.png',
    },
    hours: 1,
  },
  {
    id: '4',
    productName: 'Holi Serum',
    productImage: ['https://futuremeworld.com/wp-content/uploads/2024/02/the-hydrating-gel-cream-fantasy-655x812.jpeg'],
    offerPrice: 29.99,
    standardPrice: 34.99,
    description: 'A luxurious face cream for all skin types.',
    productQuantity: '15',
    category: [{categoryName: 'Body Care', id: 'b1'}],
    comments: [],
    store: {
      id: 's4',
      name: 'Skin Lux',
      logo: 'https://example.com/store-logo.png',
    },
    hours: 3,
  },
];


const ShopFeaturedProductsSection = () => (
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

      {featuredProducts.map((prod) => <ProductCard key={prod.id} product={prod} />)}
    </Box>
  </Box>
);

export default ShopFeaturedProductsSection;
