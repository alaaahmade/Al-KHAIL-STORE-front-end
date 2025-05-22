import { useAuthContext } from '@/auth/hooks';
import { Box, Button, Card, Stack, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().required('New password is required'),
  confirmNewPassword: Yup.string().required('Confirm new password is required').oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
})

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { resetPassword } = useAuthContext();
  

  const handleUpdatePassword =async () => {
    // Implement password update logic here
      try {
        await changePasswordSchema.validateSync({currentPassword, newPassword, confirmNewPassword}, { abortEarly: false });
        await resetPassword({currentPassword, newPassword});
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        toast.success('Password updated successfully');
      } catch (error) {
        console.log(error)
      }
    console.log('Updating password...');
  };

  return (
    <Card sx={{ p: 3 }}>
        <Stack>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Password Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Update your account password
            </Typography>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                helperText="Password must be at least 8 characters long"
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />
              <Box>
                <Button
                  variant="contained"
                  onClick={handleUpdatePassword}
                  sx={{ bgcolor: '#F73164', '&:hover': { bgcolor: '#D12753' } }}
                >
                  Update Password
                </Button>
              </Box>
            </Stack>
          </Card>
        </Stack>
    </Card>
  );
};

export default SecuritySettings;
