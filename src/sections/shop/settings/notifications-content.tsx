'use client';
import { useAuthContext } from '@/auth/hooks';
import axiosInstance from '@/utils/axios';
import {
  Box,
  Card,
  FormControlLabel,
  ListItemText,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

const NotificationsSettings = () => {
  const [currentSettings, setCurrentSettings] = useState<any>(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (user?.settings) {
      setCurrentSettings(user.settings);
    }
  }, [user]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    const updatedSettings = JSON.parse(JSON.stringify(currentSettings));

    if (name in updatedSettings.notifications) {
      updatedSettings.notifications[name] = checked;
    } else if (name in updatedSettings.Push_Notifications) {
      updatedSettings.Push_Notifications[name] = checked;
    } else if (name in updatedSettings.Newsletter_Preferences) {
      updatedSettings.Newsletter_Preferences[name] = checked;
    } else {
      console.warn(`Unknown setting name: ${name}`);
      return;
    }

    setCurrentSettings(updatedSettings);

    try {
      await axiosInstance.patch(`/v1/sellers/${user?.settings?.id}`, {
        ...updatedSettings,
      });
    } catch (error) {
      console.error('Validation or request error:', error);
    }
  };

  return (
    <Stack spacing={3}>
      {/* Email Notifications */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Email Notifications
        </Typography>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                name="Order_Updates"
                checked={currentSettings?.notifications?.Order_Updates ?? false}
                onChange={handleChange}
              />
            }
            labelPlacement="start"
            label={
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  primary="Order Updates"
                  secondary="Get notified about your order status"
                />
              </Box>
            }
            sx={{
              justifyContent: 'space-between',
              ml: 0,
              '& .MuiFormControlLabel-label': { width: '100%' },
            }}
          />

          <FormControlLabel
            control={
              <Switch
                name="Promotions_Deals"
                checked={currentSettings?.notifications?.Promotions_Deals ?? false}
                onChange={handleChange}
              />
            }
            labelPlacement="start"
            label={
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  primary="Promotions & Deals"
                  secondary="Receive updates about sales and special offers"
                />
              </Box>
            }
            sx={{
              justifyContent: 'space-between',
              ml: 0,
              '& .MuiFormControlLabel-label': { width: '100%' },
            }}
          />

          <FormControlLabel
            control={
              <Switch
                name="New_Product_Arrivals"
                checked={currentSettings?.notifications?.New_Product_Arrivals ?? false}
                onChange={handleChange}
              />
            }
            labelPlacement="start"
            label={
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  primary="New Product Arrivals"
                  secondary="Be the first to know about new products"
                />
              </Box>
            }
            sx={{
              justifyContent: 'space-between',
              ml: 0,
              '& .MuiFormControlLabel-label': { width: '100%' },
            }}
          />
        </Stack>
      </Card>

      {/* Push Notifications */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Push Notifications
        </Typography>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                name="Order_Status_Updates"
                checked={currentSettings?.Push_Notifications?.Order_Status_Updates ?? false}
                onChange={handleChange}
              />
            }
            labelPlacement="start"
            label={
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  primary="Order Status Updates"
                  secondary="Receive real-time updates about your orders"
                />
              </Box>
            }
            sx={{
              justifyContent: 'space-between',
              ml: 0,
              '& .MuiFormControlLabel-label': { width: '100%' },
            }}
          />

          <FormControlLabel
            control={
              <Switch
                name="Chat_Messages"
                checked={currentSettings?.Push_Notifications?.Chat_Messages ?? false}
                onChange={handleChange}
              />
            }
            labelPlacement="start"
            label={
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  primary="Chat Messages"
                  secondary="Get notified about new messages from sellers"
                />
              </Box>
            }
            sx={{
              justifyContent: 'space-between',
              ml: 0,
              '& .MuiFormControlLabel-label': { width: '100%' },
            }}
          />
        </Stack>
      </Card>

      {/* Newsletter Preferences */}
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Newsletter Preferences
        </Typography>
        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                name="Weekly_Newsletter"
                checked={currentSettings?.Newsletter_Preferences?.Weekly_Newsletter ?? false}
                onChange={handleChange}
              />
            }
            labelPlacement="start"
            label={
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <ListItemText
                  primary="Weekly Newsletter"
                  secondary="Receive weekly updates about trending products"
                />
              </Box>
            }
            sx={{
              justifyContent: 'space-between',
              ml: 0,
              '& .MuiFormControlLabel-label': { width: '100%' },
            }}
          />
        </Stack>
      </Card>
    </Stack>
  );
};

export default NotificationsSettings;
