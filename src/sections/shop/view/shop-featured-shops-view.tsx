'use client';
import React, { useEffect, useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchStores } from '@/redux/slices/SellersSlice';

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'followers', label: 'Most Followers' },
];

export default function ShopFeaturedShopsView() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);
  const dispatch = useAppDispatch();
  const { stores } = useAppSelector((state) => state.SellersSlice);

  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  const enrichedStores = stores.map((store) => ({
    ...store,
    rating: store.rating || 4.5,
    reviews: store.reviews || '1.2k',
    products: store.products?.length || 0,
    followers: store.followers || '10k',
    verified: store.isActive,
    avatar: store.logo,
    gradient: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
  }));

  const filtered = enrichedStores.filter(
    (shop) =>
      shop.name.toLowerCase().includes(search.toLowerCase()) ||
      shop.description.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'rating') return b.rating - a.rating;
    if (sort === 'followers') {
      const parseFollowers = (val) =>
        typeof val === 'string' && val.includes('k') ? parseFloat(val) * 1000 : parseFloat(val);
      return parseFollowers(b.followers) - parseFollowers(a.followers);
    }
    return 0; // featured or default
  });

  const perPage = 6;
  const totalPages = Math.ceil(sorted.length / perPage);
  const shopsToShow = sorted.slice((page - 1) * perPage, page * perPage);

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
        {shopsToShow.map((shop) => (
          <ShopCard key={shop.id} shop={shop} />
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
