'use client'
import { useAuthContext } from '@/auth/hooks';
import axiosInstance from '@/utils/axios';
import { Box, Card, FormControlLabel, ListItemText, Stack, Switch, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import * as Yup from 'yup'


const dataSchema = Yup.object().shape({
  notifications: Yup.object().shape({
    Order_Updates: Yup.boolean().required(),
    Promotions_Deals: Yup.boolean().required(),
    New_Product_Arrivals: Yup.boolean().required(),
    Push_Notifications: Yup.object().shape({
      Order_Status_Updates: Yup.boolean().required(),
      Chat_Messages: Yup.boolean().required(),
    }),
    Newsletter_Preferences: Yup.object().shape({
      Weekly_Newsletter: Yup.boolean().required(),
    }),
  }),
});

const NotificationsSettings = () => {
  const [currentSettings, setCurrentSettings] = useState<any>(null);
  const {user} = useAuthContext()
  console.log(user);
  

  useEffect(() => {
    if (user?.seller?.setting) {
      setCurrentSettings(user.seller.setting.notifications);
    }
  }, [user]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSettings = {
      ...currentSettings,
      [e.target.name]: e.target.checked,
    };
    setCurrentSettings(updatedSettings);
    try {
      await dataSchema.validateSync({ notifications: updatedSettings }, { abortEarly: false });
      await axiosInstance.patch(`/v1/sellers/${user?.seller?.id}`, {
        ...user?.seller,
        setting: { notifications: updatedSettings, ...user?.seller?.setting },
      });
    } catch (error) {
      console.error('Validation or request error:', error);
    }
  };

  const handleChangePush_Notifications = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSettings = {
      ...currentSettings,
      Push_Notifications: {
        ...currentSettings?.Push_Notifications,
        [e.target.name]: e.target.checked,
      },
    };
    setCurrentSettings(updatedSettings);
    try {
      await dataSchema.validateSync({ notifications: updatedSettings }, { abortEarly: false });
      await axiosInstance.patch(`/v1/sellers/${user?.seller?.id}`, {
        ...user?.seller,
        setting: { notifications: updatedSettings },
      });
    } catch (error) {
      console.error('Validation or request error:', error);
    }
  };

  const handleChangeNewsletter_Preferences = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedSettings = {
      ...currentSettings,
      Newsletter_Preferences: {
        ...currentSettings?.Newsletter_Preferences,
        [e.target.name]: e.target.checked,
      },
    };
    setCurrentSettings(updatedSettings);
    try {
      await dataSchema.validateSync({ notifications: updatedSettings }, { abortEarly: false });
      await axiosInstance.patch(`/v1/sellers/${user?.seller?.id}`, {
        ...user?.seller,
        setting: { notifications: updatedSettings },
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
          control={<Switch name="Order_Updates" checked={currentSettings?.Order_Updates} onChange={handleChange} />}
          labelPlacement="start"
          label={
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText primary="Order Updates" secondary="Get notified about your order status" />
            </Box>
          }
          sx={{ justifyContent: 'space-between', ml: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
        />
        <FormControlLabel
          control={<Switch name="Promotions_Deals" checked={currentSettings?.Promotions_Deals} onChange={handleChange} />}
          labelPlacement="start"
          label={
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText primary="Promotions & Deals" secondary="Receive updates about sales and special offers" />
            </Box>
          }
          sx={{ justifyContent: 'space-between', ml: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
        />
        <FormControlLabel
          control={<Switch name="New_Product_Arrivals" checked={currentSettings?.New_Product_Arrivals} onChange={handleChange} />}
          labelPlacement="start"
          label={
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText primary="New Product Arrivals" secondary="Be the first to know about new products" />
            </Box>
          }
          sx={{ justifyContent: 'space-between', ml: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
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
          control={<Switch name="Order_Status_Updates" checked={currentSettings?.Push_Notifications?.Order_Status_Updates} onChange={handleChangePush_Notifications} />}
          labelPlacement="start"
          label={
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText primary="Order Status Updates" secondary="Receive real-time updates about your orders" />
            </Box>
          }
          sx={{ justifyContent: 'space-between', ml: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
        />
        <FormControlLabel
          control={<Switch name="Chat_Messages" checked={currentSettings?.Push_Notifications?.Chat_Messages} onChange={handleChangePush_Notifications} />}
          labelPlacement="start"
          label={
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText primary="Chat Messages" secondary="Get notified about new messages from sellers" />
            </Box>
          }
          sx={{ justifyContent: 'space-between', ml: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
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
          control={<Switch name="Weekly_Newsletter" checked={currentSettings?.Newsletter_Preferences?.Weekly_Newsletter} onChange={handleChangeNewsletter_Preferences} />}
          labelPlacement="start"
          label={
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText primary="Weekly Newsletter" secondary="Receive weekly updates about trending products" />
            </Box>
          }
          sx={{ justifyContent: 'space-between', ml: 0, '& .MuiFormControlLabel-label': { width: '100%' } }}
        />
      </Stack>
    </Card>
  </Stack>
  )
}

export default NotificationsSettings
