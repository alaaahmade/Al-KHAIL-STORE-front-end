'use client';

// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
// components
import { useSettingsContext } from 'src/components/settings';
import { LoadingButton } from '@mui/lab';
import {  InputAdornment, CircularProgress, IconButton, Stack, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { useSnackbar } from 'notistack';
import { useAuthContext } from '@/auth/hooks';
import { fetchCategories, fetchServices } from '@/redux/slices/serviceSlice';
import { ProductCard } from '../productCard';
// ----------------------------------------------------------------------

export default function SellerProductsListView() {
  const [currentProduct, setCurrentProduct] = useState<any[]>([]);
  const [currentCategories, setCurrentCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sorting, setSorting] = useState<string>('newest');
  const settings = useSettingsContext();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const serviceState = useAppSelector((state) => state.serviceSlice);
  const services = useMemo(() => serviceState?.services || [], [serviceState?.services]);
  const categories = useMemo(() => serviceState?.categories || [], [serviceState?.categories]);
  const loading = serviceState?.loading || false;  
  const {user} = useAuthContext()  
  
  const [search, setSearch] = useState({
    query: '',
    results: [],
  });  
  useEffect(() => {
    if(!user){
      return
    }
    dispatch(fetchServices(user.seller.store.id))
      .unwrap()
      .catch((err) => {
        enqueueSnackbar(err || 'Failed to fetch services', { variant: 'error' });
      });
    dispatch(fetchCategories())
  }, [dispatch, enqueueSnackbar]);

  useEffect(() => {
    if (services.length > 0) {
      setCurrentProduct(services);
    }
    if(categories.length > 0){
      setCurrentCategories(categories);
    }
  }, [services]);

  const handleSearch = useCallback(
    (value: string) => {
      if (!value) {
        setCurrentProduct(services);
        return;
      }
      
      const filtered = services.filter((item) => 
        item.productName.toLowerCase().includes(value.toLowerCase()) ||
        item.store.name.toLowerCase().includes(value.toLowerCase()) ||
        item.description?.toLowerCase().includes(value.toLowerCase())
      );
      
      setCurrentProduct(filtered);
    },
    [services]
  );

  const handleCreateProduct = () => {
    router.push(paths.dashboard.products.create);
  };
  
  const handleFilter = useCallback(() => {
    let filtered = [...services];
  
    // Search by query
    if (search.query) {
      filtered = filtered.filter((item) =>
        item.productName.toLowerCase().includes(search.query.toLowerCase()) ||
        item.store?.name?.toLowerCase().includes(search.query.toLowerCase()) ||
        item.description?.toLowerCase().includes(search.query.toLowerCase())
      );
    }
  
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item: any) =>
        item.category?.some((cat: any) => cat.id === selectedCategory)
      );
    }
  
    // Sorting
    switch (sorting) {
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.productDate ? new Date(a.productDate).getTime() : 0;
          const dateB = b.productDate ? new Date(b.productDate).getTime() : 0;
          return dateB - dateA;
        });
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.productDate).getTime() - new Date(b.productDate).getTime());
        break;
      case 'asc':
        filtered.sort((a, b) => a.standardPrice - b.standardPrice);
        break;
      case 'desc':
        filtered.sort((a, b) => b.standardPrice - a.standardPrice);
        break;
      default:
        break;
    }
  
    setCurrentProduct(filtered);
  }, [services, search.query, selectedCategory, sorting]);
  
  useEffect(() => {
    handleFilter();
  }, [search.query, selectedCategory, sorting, services]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} >
      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4"> Products </Typography>
          <Typography variant="caption"> Manage your product catalog </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <LoadingButton
            color="inherit"
            size="small"
            type="submit"
            sx={{p: 1.5}}
            variant="contained"
            startIcon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.16667 14.6667C7.16667 14.8877 7.25446 15.0996 7.41074 15.2559C7.56702 15.4122 7.77899 15.5 8 15.5C8.22101 15.5 8.43297 15.4122 8.58926 15.2559C8.74554 15.0996 8.83333 14.8877 8.83333 14.6667V8.83333H14.6667C14.8877 8.83333 15.0996 8.74554 15.2559 8.58926C15.4122 8.43297 15.5 8.22101 15.5 8C15.5 7.77899 15.4122 7.56702 15.2559 7.41074C15.0996 7.25446 14.8877 7.16667 14.6667 7.16667H8.83333V1.33333C8.83333 1.11232 8.74554 0.900358 8.58926 0.744078C8.43297 0.587797 8.22101 0.5 8 0.5C7.77899 0.5 7.56702 0.587797 7.41074 0.744078C7.25446 0.900358 7.16667 1.11232 7.16667 1.33333V7.16667H1.33333C1.11232 7.16667 0.900358 7.25446 0.744078 7.41074C0.587797 7.56702 0.5 7.77899 0.5 8C0.5 8.22101 0.587797 8.43297 0.744078 8.58926C0.900358 8.74554 1.11232 8.83333 1.33333 8.83333H7.16667V14.6667Z" fill="white"/>
              </svg>
              }
            onClick={handleCreateProduct}
          >
            Add new Product
          </LoadingButton>
        </Stack>
      </Container>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} gap={1} sx={{  p: 2 }}>
      <OutlinedInput
        placeholder="Search..."
        value={search.query}
        size='small'
        onChange={(event) => setSearch({ ...search, query: event.target.value })}
        sx={{ width: 0.6 }}
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
        }
      />
      <Stack direction="row" spacing={1} sx={{width: 0.4}}>
      <FormControl fullWidth>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            size='small'
            sx={{
              minWidth: 100
            }}
          >
            <MenuItem value={'all'}>All Categories</MenuItem>
            {currentCategories.map((category) => (
              <MenuItem key={category.id} value={category.id}>{category.categoryName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <Select
            value={sorting}
            onChange={(e) => setSorting(e.target.value)}
            size='small'
            sx={{
              minWidth: 100
            }}
          >
            <MenuItem value={'newest'}>Sort by: Newest</MenuItem>
            <MenuItem value={'oldest'}>Sort by: Oldest</MenuItem>
            <MenuItem value={'asc'}>Sort by: Price: Low to High</MenuItem>
            <MenuItem value={'desc'}>Sort by: Price: High to Low</MenuItem>
            <MenuItem value={''}>1-3</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      </Stack>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            mt: 3,
            width: 1,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: {sx: 'center', sm: 'flex-start'},
            alignItems:{sx: 'center', sm: 'flex-start'},
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            borderRadius: 2,
            padding: 2
          }}
        >
          {Array.isArray(currentProduct) && currentProduct.length > 0 ? (
            currentProduct.map((product: any) => (
              <ProductCard 
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <Typography variant="body1" sx={{ py: 5, textAlign: 'center', width: '100%' }}>
              No services found
            </Typography>
          )}
        </Box>
      )}
    </Container>
  );
}
