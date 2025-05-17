import { Button, Card, Stack, Typography } from '@mui/material';
import React from 'react';

const SecuritySettings = () => {
  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Security Settings
      </Typography>
      <Stack spacing={2}>
        <Button variant="outlined">Change Password</Button>
        <Button variant="outlined">Enable Two-Factor Authentication</Button>
      </Stack>
    </Card>
  );
};

export default SecuritySettings;
