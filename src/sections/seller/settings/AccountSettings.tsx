'use client';
import * as Yup from 'yup';
import { useAuthContext } from '@/auth/hooks';
import { useSettingsContext } from '@/components/settings';
import {
  Button,
  Card,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import axiosInstance from '@/utils/axios';
import { LoadingButton } from '@mui/lab';
import { toast } from 'react-toastify';

const dataSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  currency: Yup.string().required('Currency is required'),
  orderNotifications: Yup.boolean(),
  reviewNotifications: Yup.boolean(),
  autoApproveReviews: Yup.boolean(),
});

const AccountSettings = () => {
  const settings = useSettingsContext();
  const { user } = useAuthContext();

  const [firstName, setFirstName] = useState(user?.firstName);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.email);
  const [currency, setCurrency] = useState('USD ($)');
  const [loading, setLoading] = useState(false);

  const handleSaveChanges = async () => {
    const data = {
      firstName,
      lastName,
      email,
      currency,
    };
    try {
      setLoading(true);
      await dataSchema.validateSync(data, { abortEarly: false });
      const response = await axiosInstance.patch(`/users/${user?.id}`, data);
      if (response.status === 200) {
        window.location.reload();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Yup.ValidationError) {
        const validationErrors = {};
        error.inner.forEach((err) => {
          validationErrors[err.path] = err.message;
        });
        toast.error(JSON.stringify(validationErrors));
      } else {
        toast.error(error.message || 'Something went wrong');
      }
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
          <LoadingButton
            variant="contained"
            size="large"
            onClick={handleSaveChanges}
            sx={{ bgcolor: '#F73164', '&:hover': { bgcolor: '#D12753' } }}
          >
            Save Changes
          </LoadingButton>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AccountSettings;
