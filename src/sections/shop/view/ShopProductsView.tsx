'use client'
import { LoadingScreen } from '@/components/loading-screen'
import { useAppDispatch, useAppSelector } from '@/redux/hooks'
import { fetchAllProducts, fetchFeaturedProducts } from '@/redux/slices/SellersSlice'
import { Box, Button, Container, FormControl, InputAdornment, InputLabel, MenuItem, Pagination, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { ProductCard } from '../productCard'
import { fetchCategories } from '@/redux/slices/serviceSlice'
import Iconify from '@/components/iconify'
import { useRouter, useSearchParams } from 'next/navigation'

const ShopProductsView = () => {

    const {products, loadingB} = useAppSelector(state => state.SellersSlice)

    const searchParams = useSearchParams()
    const categoryP = searchParams.get('category')

    const dispatch = useAppDispatch()


    useEffect(() => {
      dispatch(fetchFeaturedProducts())
    }, [dispatch])

    
    const router = useRouter()
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState('All');
    const [price, setPrice] = useState('all');
    const [sort, setSort] = useState('Featured');
    const { categories } = useAppSelector((state) => state.serviceSlice);
    const [search, setSearch] = useState('');

    useEffect(() => {
      if(categoryP) {
        setCategory(categoryP)
      }
    }, [categoryP])
    
    const itemsPerPage = 8;
    
    const filteredProducts = products
    .filter((product) => {
      const nameMatch = product.productName
        .toLowerCase()
        .includes(search.toLowerCase());

      const categoryMatch =
        category === 'All' ||
        product.category?.some((c: any) => c.categoryName === category);

      const priceValue = parseFloat(
        product.offerPrice || product.standardPrice || '0'
      );

      let priceMatch = true;
      if (price === '0 - 1000') {
        priceMatch = priceValue >= 0 && priceValue <= 1000;
      } else if (price === '1000 - 1000000') {
        priceMatch = priceValue > 1000;
      }

      return nameMatch && categoryMatch && priceMatch;
    })
    .sort((a, b) => {
      if (sort === 'Newest') {
        return (
          new Date(b.productDate).getTime() -
          new Date(a.productDate).getTime()
        );
      }
      if (sort === 'Oldest') {
        return (
          new Date(a.productDate).getTime() -
          new Date(b.productDate).getTime()
        );
      }
      return 0; // Featured (default)
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
  
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAllProducts())
  }, [dispatch]);
  
  // Reset to page 1 when filters change
  useEffect(() => {
  setPage(1);
}, [category, price, sort, search]);

const handleChangeCat = (value: string) => {
 const params = new URLSearchParams(searchParams.toString());
  params.set('category', value);
  router.push(`?${params.toString()}`);
}

if(loadingB) return <LoadingScreen/>

  return (
    <Container  sx={{px: 8, py: 1}}>

<Typography variant="h4" sx={{ my: 5 }}>
       {categoryP && categoryP + ' '} Products
      </Typography>

    <Stack sx={{width: '100%', mb: 5 }} gap= {5} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>

          <TextField
          fullWidth
            type="text"
            placeholder="Search products..."
            size='small'
            sx={{ fontSize: 16, borderRadius: 50, 
              '& .MuiOutlinedInput-root': {
                borderRadius: 50, // change this value as needed
              },
             }}
             onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" width={24} height={24} />
                </InputAdornment>
              ),
            }}
          />

          <Stack direction={"row"} alignItems={'center'} justifyContent={'flex-end'} gap={3}>
      <FormControl sx={{ minWidth: 160 }}>
          <InputLabel>Category</InputLabel>
          <Select size='small' value={category} label="Category"
          onChange={(e) => handleChangeCat(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            {Array.isArray(categories) &&
              categories.map((cat: any) => (
                <MenuItem key={cat.id} value={cat.categoryName}>
                  {cat.categoryName}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
        <FormControl size='small' sx={{ minWidth: 160 }}>
          <InputLabel>Price Range</InputLabel>
          <Select value={price} label="Price Range" onChange={(e) => setPrice(e.target.value)}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="0 - 1000">0 - 1000</MenuItem>
            <MenuItem value="1000 - 1000000">1000 - 1000000</MenuItem>
          </Select>
        </FormControl>
    <FormControl size='small' sx={{ minWidth: 160 }}>
    <InputLabel>Sort</InputLabel>
    <Select value={sort} label="Sort" onChange={(e) => setSort(e.target.value)}>
      <MenuItem value="Featured">Featured</MenuItem>
      <MenuItem value="Newest">Newest</MenuItem>
      <MenuItem value="Oldest">Oldest</MenuItem>
    </Select>
  </FormControl>
  </Stack>
    </Stack>

      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
        
      >
        {paginatedProducts.length > 0 ? paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        )) : 
          <Typography
          width={'100%'}
            textAlign={'center'}
          >
            There is no Products found
          </Typography>
        }
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
    </Container>
  );
}

export default ShopProductsView
