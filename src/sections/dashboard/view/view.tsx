'use client';

// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { fDate } from 'src/utils/format-time';
import DashboardContent from '../dashpoard-content';
import { Button } from '@mui/material';
import { useAuthContext } from '@/auth/hooks';
import axiosInstance, { endpoints } from '@/utils/axios';

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>      
      <DashboardContent />
    </Container>
  );
}
