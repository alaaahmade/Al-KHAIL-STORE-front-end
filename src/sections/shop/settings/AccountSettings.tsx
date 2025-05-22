import { Card, Stack, Typography } from '@mui/material';
import React from 'react';

const AccountSettings = () => {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Profile Information
      </Typography>
      <Stack spacing={1}>
        <Typography variant="body2">Name: John Doe</Typography>
        <Typography variant="body2">Email: john@example.com</Typography>
        <Typography variant="body2">Phone: +1 234 567 890</Typography>
      </Stack>
    </Card>
  );
};

export default AccountSettings;
