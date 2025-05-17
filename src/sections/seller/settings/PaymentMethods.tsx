import { Box, Button, Card, Divider, Stack, Typography } from '@mui/material';
import Iconify from '@/components/iconify';
import Label from '@/components/label';

const PaymentMethods = () => {
  return (
    <Card sx={{ p: 4 }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight="bold">
          Payment Methods
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="material-symbols:add" />}
          sx={{ borderRadius: 1, textTransform: 'none', px: 3, bgcolor: 'primary.main' }}
        >
          Add New Card
        </Button>
      </Stack>

      {/* Saved Cards */}
      <Stack spacing={2}>
        <Card
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 2,
            borderColor: 'divider',
            backgroundColor: '#F9FAFB',
            position: 'relative'
          }}
        >
          <Stack direction="row" spacing={1} mt={1} alignItems={'center'} gap={2}>
          <Iconify color={'#2563eb'} icon="fontisto:visa" width={40} height={35} />

          <Box>
          <Typography variant="body1" fontWeight={500}>
            Visa ending in 4242
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Exp: 08/2025 — 
          </Typography>
          </Box>
          </Stack>
          <Stack direction="row" spacing={1} mt={1} alignItems={'center'}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
            }}
          >
          <Label
            sx={{
              p: 2,
              borderRadius: 50
            }}
            color="success"
          >Default</Label>
            <Iconify icon="pepicons-pencil:dots-y" width={25} height={25} />

          </Stack>
        </Card>

        <Card
          variant="outlined"
          sx={{
            p: 2.5,
            borderRadius: 2,
            borderColor: 'divider',
            backgroundColor: '#F9FAFB',
            position: 'relative',
          }}
        >
          <Stack direction="row" spacing={1} mt={1} alignItems={'center'}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
            }}
          >
            <Iconify icon="pepicons-pencil:dots-y" width={25} height={25} />

          </Stack>
          <Stack direction="row" spacing={1} mt={1} alignItems={'center'} gap={2}>
          <Iconify color={'#ea580c'} icon="cib:cc-mastercard" width={40} height={35} />
            <Box>
            <Typography variant="body1" fontWeight={500}>
            Mastercard ending in 8888
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Exp: 12/2025
          </Typography>
            </Box>
          </Stack>
        </Card>
      </Stack>

      {/* Divider */}
      <Divider sx={{ my: 4 }} />

      {/* Other Methods */}
      <Typography variant="subtitle1" fontWeight={600} mb={2}>
        Other Payment Methods
      </Typography>

      <Stack spacing={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">PayPal</Typography>
          <Button variant="outlined" color="error" sx={{ textTransform: 'none' }}>
            Disconnect
          </Button>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body1">Apple Pay</Typography>
          <Button variant="outlined" sx={{ textTransform: 'none' }}>
            Connect
          </Button>
        </Box>
      </Stack>
    </Card>
  );
};

export default PaymentMethods;
