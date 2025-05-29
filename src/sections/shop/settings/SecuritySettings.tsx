'use client';
import * as Yup from 'yup';
import { useAuthContext } from '@/auth/hooks';
import { Box, Button, Card, Grid, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().required('New password is required'),
  confirmNewPassword: Yup.string()
    .required('Confirm new password is required')
    .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
});
const SecuritySettings = () => {
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const { resetPassword } = useAuthContext();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleUpdatePassword = async () => {
    // Implement password update logic here
    try {
      await changePasswordSchema.validateSync(
        { currentPassword, newPassword, confirmNewPassword },
        { abortEarly: false }
      );
      await resetPassword({ currentPassword, newPassword });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      toast.success('Password updated successfully');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        setErrors(validationErrors);
      }
      toast.error(error.message || 'Something went wrong');
    }
    console.log('Updating password...');
  };

  useEffect(() => {
    setErrors({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  }, [currentPassword, newPassword, confirmNewPassword]);

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 0 }}>
        Security Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
                error={!!errors.currentPassword}
                helperText={errors.currentPassword ? errors.currentPassword : ''}
              />
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                error={!!errors.newPassword}
                helperText={errors.newPassword ? errors.newPassword : ''}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                error={!!errors.confirmNewPassword}
                helperText={errors.confirmNewPassword ? errors.confirmNewPassword : ''}
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
        </Grid>
      </Grid>
    </Card>
  );
};

export default SecuritySettings;
