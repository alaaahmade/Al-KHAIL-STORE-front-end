'use client';

// @mui
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
// components
import { useSettingsContext } from 'src/components/settings';
import { fDate } from 'src/utils/format-time';
import DashboardContent from '../dashpoard-content';

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Dashboard </Typography>
      <Typography
        sx={{
          opacity: 0.5,
          fontWeight: 100
        }}
      variant="body1">
        Status for {fDate(new Date(), 'MMM yyy')}
      </Typography>
      
      <DashboardContent />
    </Container>
  );
}
