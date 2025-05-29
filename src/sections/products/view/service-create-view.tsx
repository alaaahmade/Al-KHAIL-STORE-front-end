'use client';

import { Container } from '@mui/material';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { paths } from 'src/routes/paths';
import ProductNewEditForm from '../product-new-edit-form';

export default function ProductCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new product"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Products', href: paths.dashboard.products.root },
          { name: 'New Product' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <ProductNewEditForm />
    </Container>
  );
}
