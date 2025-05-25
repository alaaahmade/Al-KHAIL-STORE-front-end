'use client'
import * as Yup from 'yup';
import { useSettingsContext } from 'src/components/settings';
import { Box, Button, Card, Container, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useAuthContext } from '@/auth/hooks';
import axiosInstance from '@/utils/axios';
import { toast } from 'react-toastify';

const dataSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  currency: Yup.string().required('Currency is required'),
  // currentPassword: Yup.string().required('Current password is required'),
  // newPassword: Yup.string().required('New password is required'),
  // confirmNewPassword: Yup.string().required('Confirm new password is required').oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  orderNotifications: Yup.boolean(),
  reviewNotifications: Yup.boolean(),
  autoApproveReviews: Yup.boolean(),
  defaultReplyTemplate: Yup.string().required('Default reply template is required'),
})

const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string().required('New password is required'),
  confirmNewPassword: Yup.string().required('Confirm new password is required').oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
})

const SettingsView = () => {
  const settings = useSettingsContext();
  const {user, resetPassword} = useAuthContext();

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [email, setEmail] = useState(user.email);
  const [currency, setCurrency] = useState('USD ($)');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [orderNotifications, setOrderNotifications] = useState(true);
  const [reviewNotifications, setReviewNotifications] = useState(true);
  const [autoApproveReviews, setAutoApproveReviews] = useState(false);
  const [defaultReplyTemplate, setDefaultReplyTemplate] = useState(
    'Thank you for your feedback! We appreciate your support.'
  );


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
        toast.error(error.message || 'Something went wrong');
      }
    // await login?.(data.email, data.password);
    console.log('Updating password...');
  };

  const handleSaveChanges =  async () => {
    // Implement save changes logic here
    const data = {
      firstName,
      lastName,
      email,
      currency,
      orderNotifications,
      reviewNotifications,
      autoApproveReviews,
      defaultReplyTemplate
    }
     try {
       await dataSchema.validateSync(data, { abortEarly: false });
       const response = await axiosInstance.patch(`/users/${user.id}`, data);
       if(response.status === 200){
        window.location.reload();
       }
      //  console.log('Saving changes...');
     } catch (error) {
       console.log(error);
     }
    
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage your account preferences and system settings
      </Typography>

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12}>
          <Card sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              General Settings
            </Typography>
            <Stack spacing={2}>
              <Stack spacing={2} direction={'row'} alignItems={'center'}>
              <TextField
                fullWidth
                label="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                fullWidth
                label="LastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              </Stack>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={currency}
                  label="Currency"
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <MenuItem value="USD ($)">USD ($)</MenuItem>
                  <MenuItem value="EUR (€)">EUR (€)</MenuItem>
                  <MenuItem value="GBP (£)">GBP (£)</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Card>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleSaveChanges}
            sx={{ bgcolor: '#F73164', '&:hover': { bgcolor: '#D12753' } }}
          >
            Save Changes
          </Button>
        </Grid>
                {/* Password Settings */}
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
        </Grid>
      </Grid>
    </Container>
  );
}

export default SettingsView
