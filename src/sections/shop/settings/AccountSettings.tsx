import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  Stack,
  Typography,
  Avatar,
  Button,
  TextField,
  Switch,
  Divider,
} from '@mui/material';
import Iconify from '@/components/iconify';
import { useAuthContext } from '@/auth/hooks';
import { toast } from 'react-toastify';
import axiosInstance from '@/utils/axios';

const AccountSettings = () => {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promotions, setPromotions] = useState(false);
  const [edit, setEdit] = useState(false);
  const { user } = useAuthContext();
  const [currentSettings, setCurrentSettings] = useState<any>({
    firstName: 'John Doe',
    lastName: 'Doe',
    email: '5o4Hb@example.com',
    phone: '1234567890',
    photo: '',
  });
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [loadingPhoto, setLoadingPhoto] = useState(false);

  useEffect(() => {
    if (user) {
      setCurrentSettings({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber,
        photo: user.photo,
      });
      setPreviewPhoto(user.photo || null);
    }
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewPhoto(e.target.files[0]);
      setPreviewPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleChangeField = (e: any) => {
    setCurrentSettings({
      ...currentSettings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (!edit) {
      setEdit(true);
      return;
    }
    try {
      let photoUrl = currentSettings.photo;
      if (newPhoto) {
        setLoadingPhoto(true);
        const formData = new FormData();
        formData.append('file', newPhoto);
        const data = await axiosInstance.post('/v1/files/upload', formData);
        photoUrl = data.data.url;
        setLoadingPhoto(false);
      }
      const response = await axiosInstance.patch(`/users/${user?.id}`, {
        ...currentSettings,
        photo: photoUrl,
      });
      setCurrentSettings((prev: any) => ({ ...prev, photo: photoUrl }));
      setEdit(false);
      setNewPhoto(null);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      setLoadingPhoto(false);
      toast.error(error.message || 'Failed to update profile');
    }
  };

  return (
    <Box sx={{ flex: 1 }}>
      <Card sx={{ p: { xs: 2, md: 4 }, position: 'relative', boxShadow: 0 }}>
        {/* Profile Info */}
        <Button
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
          }}
          color="primary"
          startIcon={
            edit ? (
              <Iconify icon="eva:save-fill" width="24" height="24" />
            ) : (
              <Iconify icon="mage:edit" width="24" height="24" />
            )
          }
          onClick={handleSave}
        >
          {edit ? 'Save' : 'Edit'}
        </Button>
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Profile Information
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={3}
          alignItems="center"
          sx={{ mb: 3 }}
        >
          <Avatar
            src={previewPhoto || currentSettings.photo}
            alt="Profile"
            sx={{ width: 72, height: 72, mb: 1 }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <Button
              component="label"
              variant="contained"
              color="primary"
              size="small"
              sx={{ textTransform: 'none', mb: 0.5, color: '#fff' }}
              disabled={!edit}
            >
              {loadingPhoto ? 'Uploading...' : 'Change Photo'}
              <input type="file" accept="image/*" hidden onChange={handlePhotoChange} />
            </Button>
            <Typography variant="caption" color="text.secondary">
              Maximum file size: 2MB
            </Typography>
          </Box>
        </Stack>
        <Box sx={{ flex: 1 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <TextField
              label="First Name"
              size="small"
              value={currentSettings.firstName}
              name="firstName"
              onChange={handleChangeField}
              disabled={!edit}
              fullWidth
              InputProps={{ readOnly: !edit }}
            />
            <TextField
              label="Last Name"
              size="small"
              name="lastName"
              onChange={handleChangeField}
              value={currentSettings.lastName}
              disabled={!edit}
              fullWidth
              InputProps={{ readOnly: !edit }}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              label="Email"
              size="small"
              name="email"
              onChange={handleChangeField}
              value={currentSettings.email}
              disabled={!edit}
              fullWidth
              InputProps={{ readOnly: !edit }}
            />
            <TextField
              label="Phone"
              size="small"
              name="phone"
              onChange={handleChangeField}
              value={currentSettings.phone}
              disabled={!edit}
              fullWidth
              InputProps={{ readOnly: !edit }}
            />
          </Stack>
        </Box>
        <Divider sx={{ my: 3 }} />
        {/* Email Preferences */}
        <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
          Email Preferences
        </Typography>
        <Stack spacing={2}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Order Updates
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Receive updates about your orders
              </Typography>
            </Box>
            <Switch
              checked={orderUpdates}
              onChange={(e) => setOrderUpdates(e.target.checked)}
              color="primary"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'primary.main',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'primary.main',
                },
              }}
            />
          </Stack>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="body2" fontWeight={500}>
                Promotions
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Receive promotional offers and discounts
              </Typography>
            </Box>
            <Switch
              checked={promotions}
              onChange={(e) => setPromotions(e.target.checked)}
              color="secondary"
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: 'secondary.main',
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: 'primary.main',
                },
              }}
            />
          </Stack>
        </Stack>
      </Card>
    </Box>
  );
};

export default AccountSettings;
