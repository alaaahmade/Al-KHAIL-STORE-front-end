'use client'
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Pagination,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShopCard from '../shop-card';

const mockShops = [
  {
    id: 1,
    name: 'Beauty Haven',
    description: 'Premium skincare and makeup products',
    rating: 4.8,
    reviews: '2.4k',
    products: 245,
    followers: '12k',
    verified: true,
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    gradient: 'linear-gradient(90deg, #d53369 0%, #daae51 100%)',
  },
  {
    id: 2,
    name: 'Glow & Glamour',
    description: 'Luxury cosmetics and fragrances',
    rating: 4.7,
    reviews: '1.8k',
    products: 189,
    followers: '8.5k',
    verified: true,
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    gradient: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
  },
  {
    id: 3,
    name: 'Natural Beauty Co.',
    description: 'Organic and natural beauty products',
    rating: 4.9,
    reviews: '3.2k',
    products: 156,
    followers: '15k',
    verified: true,
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    gradient: 'linear-gradient(90deg, #d53369 0%, #daae51 100%)',
  },
];

const shopList = [
  ...mockShops,
  ...mockShops,
];

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'followers', label: 'Most Followers' },
];

export default function ShopFeaturedShopsView() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);

  // Pagination logic (6 per page)
  const perPage = 6;
  const filtered = shopList.filter(
    (shop) =>
      shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.description.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / perPage);
  const shopsToShow = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Featured Shops
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Home {'>'} Shops
      </Typography>
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 4,
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          alignItems: 'center',
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Search shops..."
          size="small"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ flex: 1, minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          sx={{ minWidth: 170 }}
        >
          {sortOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              Sort by: {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Grid container spacing={3}>
        {shopsToShow.map((shop, idx) => (
          <ShopCard key={shop.id + '-' + idx} shop={shop}/>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, val) => setPage(val)}
          color="primary"
          shape="rounded"
          siblingCount={1}
          boundaryCount={1}
        />
      </Box>
    </Box>
  );
}
