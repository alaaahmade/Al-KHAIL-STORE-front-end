import { Card, Typography, Stack, Box, Avatar } from '@mui/material';

const customers = [
  {
    id: 1,
    name: 'Sarah Johnson',
    nikName: 'Founder & CEO',
    photo:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlVparuZ4feRMJDAKgjimGIgPRBCI5jgvPrQ&s',
  },
  {
    id: 2,
    name: 'Michael Chen',
    nikName: 'CTO',
    photo:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM5WDOz1LhCe2cXGWP2xinsPVNjvnLsEBaKA&s',
  },
  {
    id: 3,
    name: 'Emma Wilson',
    nikName: 'COO',
    photo: 'https://music.wustl.edu/files/music/People/Sarah%20Johnson.jpeg',
  },
];

export default function ShopAboutSection() {
  return (
    <>
      <Card
        sx={{ p: 4, borderRadius: 2, boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)', mt: 3, px: 15 }}
      >
        <Typography variant="h5" fontWeight={700} mb={2}>
          About Beauty Haven
        </Typography>
        <Typography mb={3}>
          Founded in 2020, Beauty Haven has become a leading destination for premium cosmetics and
          skincare products. Our mission is to provide high-quality beauty products that enhance
          natural beauty while promoting skin health.
        </Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          justifyContent="center"
          alignItems="center"
          mb={3}
        >
          <Box textAlign="center">
            <Typography variant="h4" color="#EC4899" fontWeight={700}>
              5000+
            </Typography>
            <Typography variant="body2">Happy Customers</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="#EC4899" fontWeight={700}>
              245
            </Typography>
            <Typography variant="body2">Products</Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" color="#EC4899" fontWeight={700}>
              98%
            </Typography>
            <Typography variant="body2">Satisfaction Rate</Typography>
          </Box>
        </Stack>
      </Card>
      <Card
        sx={{ p: 4, borderRadius: 2, boxShadow: '2px 2px 12px rgba(0, 0, 0, 0.1)', mt: 3, px: 15 }}
      >
        <Typography variant="h6" fontWeight={600} mb={2}>
          Our Team
        </Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={4}
          justifyContent="center"
          alignItems="center"
          mb={3}
        >
          {customers.map((customer) => (
            <Box
              textAlign="center"
              key={customer.id}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
              }}
            >
              <Avatar
                alt={customer.name}
                src={customer.photo}
                sx={{ width: 80, height: 80, borderRadius: '50%' }}
              />
              <Typography fontWeight={600}>{customer.name}</Typography>
              <Typography variant="caption" color="#EC4899">
                {customer.nikName}
              </Typography>
            </Box>
          ))}
        </Stack>
        <Typography variant="h6" fontWeight={600} mb={2}>
          Our Values
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4}>
          <Box>
            <Typography fontWeight={600} color="#EC4899">
              Natural Ingredients
            </Typography>
            <Typography variant="body2">
              We prioritize natural, sustainable ingredients in all our products.
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight={600} color="#EC4899">
              Science-Backed
            </Typography>
            <Typography variant="body2">
              All products are thoroughly tested and scientifically proven.
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight={600} color="#EC4899">
              Cruelty-Free
            </Typography>
            <Typography variant="body2">
              We never test on animals and support ethical beauty practices.
            </Typography>
          </Box>
          <Box>
            <Typography fontWeight={600} color="#EC4899">
              Eco-Friendly
            </Typography>
            <Typography variant="body2">
              Committed to sustainable packaging and environmental responsibility.
            </Typography>
          </Box>
        </Stack>
      </Card>
    </>
  );
}
