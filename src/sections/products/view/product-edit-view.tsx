'use client';

import { useEffect } from 'react';
// @mui
import Container from '@mui/material/Container';
import { CircularProgress } from '@mui/material';
// routes
import { paths } from 'src/routes/paths';
// components
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { useSnackbar } from 'notistack';
//
import { fetchProductById } from '@/redux/slices/productsReducer';
import ProductNewEditForm from '../product-new-edit-form';
import { LoadingScreen } from '@/components/loading-screen';

// ----------------------------------------------------------------------

export default function ProductEditView() {
  const { productId } = useParams();
  const settings = useSettingsContext();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const ProductsState = useAppSelector((state) => state.products);
  const currentProduct = ProductsState?.currentProduct ;
  const loading = ProductsState?.loading || false;  
  
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(Number(productId)))
    }
  }, [dispatch, productId, enqueueSnackbar]);

  if (loading) return <LoadingScreen/>
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Products',
            href: paths.dashboard.products.root,
          },
          {
            name: currentProduct?.productName || '',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm currentProduct={currentProduct} />
    </Container>
  );
}
