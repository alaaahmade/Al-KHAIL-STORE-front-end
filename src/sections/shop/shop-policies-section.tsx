import { Card, Typography, Stack, Box, Button } from '@mui/material';
import Iconify from '@/components/iconify';

export default function ShopPoliciesSection() {
  return (
    <Card sx={{ p: 4, borderRadius: 3, boxShadow: 1, mt: 3,px: 15 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Store Policies
      </Typography>
      <Stack spacing={2} mb={3}>
        <Box>
          <Typography fontWeight={600} color="#EC4899" display="flex" alignItems="center" mb={0.5}>
            
            <Iconify icon="fa-solid:shipping-fast" width={20} height={20} style={{ marginRight: 8 }} /> Shipping Policy
          </Typography>
          <Box
            sx={{ml: 2}}
          >
          <Typography variant="body2">• Free shipping on orders over $50 within the United States</Typography>
          <Typography variant="body2">• Standard shipping (5-7 business days)</Typography>
          <Typography variant="body2">• Express shipping (2-3 business days) available at additional cost</Typography>
          <Typography variant="body2">• International shipping available to select countries</Typography>
          </Box>
        </Box>
        <Box>
          <Typography fontWeight={600} color="#EC4899" display="flex" alignItems="center" mb={0.5}>
            
            <Iconify  icon="pepicons-pencil:arrow-spin"width={20} height={20} style={{ marginRight: 8 }} /> Return & Refund Policy
          </Typography>
          <Box
            sx={{ml: 2}}
          >
          <Typography variant="body2">• 30-day return window for unused items</Typography>
          <Typography variant="body2">• Items must be in original packaging</Typography>
          <Typography variant="body2">• Refunds processed within 5-7 business days</Typography>
          <Typography variant="body2">• Return shipping costs covered for defective items</Typography>
        </Box>
        </Box>
        <Box>
          <Typography fontWeight={600} color="#EC4899" display="flex" alignItems="center" mb={0.5}>
            
            <Iconify icon="carbon:manage-protection" width={20} height={20} style={{ marginRight: 8 }} /> Privacy Policy
          </Typography>
          <Box
            sx={{ml: 2}}
          >
          <Typography variant="body2">• We protect your personal information</Typography>
          <Typography variant="body2">• Data is never shared with third parties</Typography>
          <Typography variant="body2">• Secure payment processing</Typography>
          <Typography variant="body2">• Cookie policy compliance with GDPR</Typography>
          </Box>
        </Box>
        <Box>
          <Typography fontWeight={600} color="#EC4899" display="flex" alignItems="center" mb={0.5}>
            <Iconify icon="mdi:file-document-outline" width={20} height={20} style={{ marginRight: 8 }} /> Terms of Service
          </Typography>
          <Box
            sx={{ml: 2}}
          >
          <Typography variant="body2">• Product authenticity guarantee</Typography>
          <Typography variant="body2">• Price match policy</Typography>
          <Typography variant="body2">• Account terms and conditions</Typography>
          <Typography variant="body2">• Dispute resolution process</Typography>
        </Box>
        </Box>
      </Stack>
      <Box sx={{ bgcolor: '#F3F4F6', borderRadius: 2, p: 2, mt: 2 }}>
        <Typography fontWeight={600} mb={1}>Need More Information?</Typography>
        <Typography variant="body2" mb={2}>
          If you have any questions about our policies, please don’t hesitate to contact our customer service team.
        </Typography>
        <Button variant="contained" color="primary" startIcon={<Iconify icon="mdi:headset" />}>
          Contact Support
        </Button>
      </Box>
    </Card>
  );
}
