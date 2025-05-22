import { Card, Stack, Typography } from '@mui/material';

const StoreInformation = () => {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Store Information
      </Typography>
      <Stack spacing={1}>
        <Typography variant="body2">Store Name: Tech World</Typography>
        <Typography variant="body2">Seller ID: #123456</Typography>
        <Typography variant="body2">Joined: Jan 1, 2023</Typography>
      </Stack>
    </Card>
  );
};

export default StoreInformation;
