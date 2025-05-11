'use client';

// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
// components
import { useSettingsContext } from 'src/components/settings';
import { LoadingButton } from '@mui/lab';
import {  InputAdornment, CircularProgress } from '@mui/material';
import Iconify from 'src/components/iconify';
import { useCallback, useState, useEffect, useMemo } from 'react';
import { paths } from 'src/routes/paths';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { fetchServices } from 'src/redux/slices/serviceSlice';
import { useSnackbar } from 'notistack';
import ListingCard from '../card';
// ----------------------------------------------------------------------

export default function TwoView() {
  const settings = useSettingsContext();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const serviceState = useAppSelector((state) => state.service);
  const services = useMemo(() => serviceState?.services || [], [serviceState?.services]);
  const loading = serviceState?.loading || false;  
  
  const [search, setSearch] = useState({
    query: '',
    results: [],
  });
  const [currentListing, setCurrentListing] = useState<any[]>([]);

  useEffect(() => {
    dispatch(fetchServices())
      .unwrap()
      .catch((err) => {
        enqueueSnackbar(err || 'Failed to fetch services', { variant: 'error' });
      });
  }, [dispatch, enqueueSnackbar]);

  useEffect(() => {
    if (services.length > 0) {
      setCurrentListing(services);
    }
  }, [services]);

  const handleSearch = useCallback(
    (value: string) => {
      if (!value) {
        setCurrentListing(services);
        return;
      }
      
      const filtered = services.filter((item) => 
        item.title.toLowerCase().includes(value.toLowerCase()) ||
        item.vendor.toLowerCase().includes(value.toLowerCase()) ||
        item.description?.toLowerCase().includes(value.toLowerCase())
      );
      
      setCurrentListing(filtered);
    },
    [services]
  );

  const handleCreateListing = () => {
    router.push(paths.dashboard.service.create);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'} >
      <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="h4"> My Services </Typography>
      <LoadingButton
        color="inherit"
        size="medium"
        type="submit"
        variant="contained"
        startIcon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.16667 14.6667C7.16667 14.8877 7.25446 15.0996 7.41074 15.2559C7.56702 15.4122 7.77899 15.5 8 15.5C8.22101 15.5 8.43297 15.4122 8.58926 15.2559C8.74554 15.0996 8.83333 14.8877 8.83333 14.6667V8.83333H14.6667C14.8877 8.83333 15.0996 8.74554 15.2559 8.58926C15.4122 8.43297 15.5 8.22101 15.5 8C15.5 7.77899 15.4122 7.56702 15.2559 7.41074C15.0996 7.25446 14.8877 7.16667 14.6667 7.16667H8.83333V1.33333C8.83333 1.11232 8.74554 0.900358 8.58926 0.744078C8.43297 0.587797 8.22101 0.5 8 0.5C7.77899 0.5 7.56702 0.587797 7.41074 0.744078C7.25446 0.900358 7.16667 1.11232 7.16667 1.33333V7.16667H1.33333C1.11232 7.16667 0.900358 7.25446 0.744078 7.41074C0.587797 7.56702 0.5 7.77899 0.5 8C0.5 8.22101 0.587797 8.43297 0.744078 8.58926C0.900358 8.74554 1.11232 8.83333 1.33333 8.83333H7.16667V14.6667Z" fill="white"/>
          </svg>
          }
        onClick={handleCreateListing}
      >
        Create a listing
      </LoadingButton>
      </Container>
      
      <OutlinedInput
        placeholder="Search..."
        value={search.query}
        onChange={(event) => {
          setSearch({ ...search, query: event.target.value });
          handleSearch(event.target.value);
        }}
        sx={{ width: 0.4 }}
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
          </InputAdornment>
        }
      />
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            mt: 5,
            width: 1,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: {sx: 'center', sm: 'flex-start'},
            alignItems:{sx: 'center', sm: 'flex-start'},
            gap: 5,
            flexDirection: { xs: 'column', sm: 'row' },
            borderRadius: 2,
          }}
        >
          {Array.isArray(currentListing) && currentListing.length > 0 ? (
            currentListing.map(({ id, title, images, hours, vendor, credits }) => (
              <ListingCard 
                key={id}
                id={id}
                title={title}
                images={images || []}
                hours={hours}
                vendor={vendor}
                credits={credits?.toString() || '0'}
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
