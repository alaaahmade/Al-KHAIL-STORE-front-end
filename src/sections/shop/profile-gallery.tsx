'use client'

// @mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FormControl, InputLabel, MenuItem, Pagination, Select, Stack } from '@mui/material';
// hooks and redux
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchCategories } from '@/redux/slices/serviceSlice';
// components
import { ProductCard } from './productCard';
import { LoadingScreen } from '@/components/loading-screen';

type Props = {
  products: any[];
};

export default function ProfileProducts({ products }: Props) {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('All');
  const [price, setPrice] = useState('all');
  const dispatch = useAppDispatch();
  const [sort, setSort] = useState('Featured');

  const { categories } = useAppSelector((state) => state.serviceSlice);

  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  // Reset to page 1 when filters change
useEffect(() => {
  setPage(1);
}, [category, price, sort]);


  if(!products) return <LoadingScreen/>

  const filteredProducts = products
  .filter((product) => {
    const categoryMatch =
      category === 'All' || product.category?.some((c: any) => c.categoryName === category);

    const priceValue = parseFloat(product.offerPrice || product.standardPrice || '0');

    let priceMatch = true;
    if (price === '0 - 1000') {
      priceMatch = priceValue >= 0 && priceValue <= 1000;
    } else if (price === '1000 - 1000000') {
      priceMatch = priceValue > 1000;
    }

    return categoryMatch && priceMatch;
  })
  .sort((a, b) => {
    if (sort === 'Newest') {
      return new Date(b.productDate).getTime() - new Date(a.productDate).getTime();
    }
    if (sort === 'Oldest') {
      return new Date(a.productDate).getTime() - new Date(b.productDate).getTime();
    }
    return 0; // Featured (default) - no sort
  });




  // Pagination after filtering
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };


  return (
    <>
    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
    <Stack
        width={'20em'}
        spacing={2}
        direction={'row'}
        alignItems={'center'}
        justifyContent={'flex-start'}
        m={1}
        mt={5}
      >
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {Array.isArray(categories) &&
              categories.map((cat: any) => (
                <MenuItem key={cat.id} value={cat.categoryName}>
                  {cat.categoryName}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Price Range</InputLabel>
          <Select value={price} label="Price Range" onChange={(e) => setPrice(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="0 - 1000">0 - 1000</MenuItem>
            <MenuItem value="1000 - 1000000">1000 - 1000000</MenuItem>
          </Select>
        </FormControl>
      </Stack>
    <FormControl sx={{ minWidth: 160 }}>
    <InputLabel>Sort</InputLabel>
    <Select value={sort} label="Sort" onChange={(e) => setSort(e.target.value)}>
      <MenuItem value="Featured">Featured</MenuItem>
      <MenuItem value="Newest">Newest</MenuItem>
      <MenuItem value="Oldest">Oldest</MenuItem>
    </Select>
  </FormControl>
    </Stack>


      <Typography variant="h4" sx={{ my: 5 }}>
        Products
      </Typography>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
      >
        { paginatedProducts && paginatedProducts?.length > 0 ? paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        )) : <Typography variant="h6" sx={{ color: 'text.secondary' }}>No products found</Typography>}
      </Box>

      <Box mt={4} display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChangePage}
          shape="rounded"
          color="primary"
          sx={{
            '& .Mui-selected': {
              backgroundColor: '#D81B60',
              color: '#fff',
            },
          }}
        />
      </Box>
    </>
  );
}
