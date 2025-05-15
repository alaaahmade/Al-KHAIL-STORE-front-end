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
import { fetchServiceById } from 'src/redux/slices/serviceSlice';
import { useSnackbar } from 'notistack';
//
import ServiceNewEditForm from '../service-new-edit-form';

// ----------------------------------------------------------------------

export default function ServiceEditView() {
  const { id } = useParams();
  const settings = useSettingsContext();
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const serviceState = useAppSelector((state) => state.service);
  const currentService = serviceState?.currentService ;
  const loading = serviceState?.loading || false;

  

  useEffect(() => {
    if (id) {
      dispatch(fetchServiceById(Number(id)))
        .unwrap()
        .catch((err) => {
          enqueueSnackbar(err || 'Failed to fetch service details', { variant: 'error' });
        });
    }
  }, [dispatch, id, enqueueSnackbar]);

  if (loading || !currentService) {
    return (
      <Container sx={{ textAlign: 'center', py: 5 }}>
        <CircularProgress />
      </Container>
    );
  }

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
            name: 'Services',
            href: paths.dashboard.service.root,
          },
          {
            name: currentService?.title || '',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ServiceNewEditForm currentService={currentService} />
    </Container>
  );
}
