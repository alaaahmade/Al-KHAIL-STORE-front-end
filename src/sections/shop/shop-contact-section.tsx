import { Card, Typography, Stack, Box, Button, TextField } from '@mui/material';
import Iconify from '@/components/iconify';

export default function ShopContactSection() {
  return (
    <Card sx={{ p: 4, borderRadius: 3, boxShadow: 1, mt: 3 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Contact
      </Typography>
      <Typography mb={3}>
        If you have any questions or inquiries, please fill out the form below or contact our support team directly.
      </Typography>
      <Stack spacing={2} mb={3}>
        <TextField label="Your Name" fullWidth />
        <TextField label="Your Email" fullWidth />
        <TextField label="Message" fullWidth multiline rows={4} />
        <Button variant="contained" color="secondary" startIcon={<Iconify icon="mdi:send-outline" />}>Send Message</Button>
      </Stack>
      <Box sx={{ bgcolor: '#F3F4F6', borderRadius: 2, p: 2, mt: 2 }}>
        <Typography fontWeight={600} mb={1}>Customer Support</Typography>
        <Typography variant="body2" mb={2}>
          Email: support@beautyhaven.com<br />
          Phone: +1 (800) 123-4567
        </Typography>
        <Button variant="outlined" color="secondary" startIcon={<Iconify icon="mdi:headset" />}>
          Contact Support
        </Button>
      </Box>
    </Card>
  );
}
