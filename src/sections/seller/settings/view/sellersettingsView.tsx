'use client';

import React, { useState } from 'react';
import {
  Card,
  Container,
  Grid,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText as MUIListItemText,
} from '@mui/material';

import { useAuthContext } from '@/auth/hooks';
import { useSettingsContext } from 'src/components/settings';
import Iconify from '@/components/iconify';
import NotificationsSettings from '../notifications-content';
import AccountSettings from '../AccountSettings';
import SecuritySettings from '../SecuritySettings';
import PaymentMethods from '../PaymentMethods';
import ShippingAddress from '../ShippingAddress';
import StoreInformation from '../StoreInformation';


const tabs = [
  { label: 'Notifications', icon: <Iconify icon="mingcute:notification-fill" width="24" height="24" /> },
  { label: 'Account', icon: <Iconify icon="material-symbols:person" width="24" height="24" /> },
  { label: 'Payment Methods', icon: <Iconify icon="fluent:payment-16-filled" width="24" height="24" /> },
  { label: 'Shipping', icon: <Iconify icon="fa-solid:shipping-fast" width="24" height="24" /> },
  { label: 'Store Information', icon: <Iconify icon="fa6-solid:store" width="576" height="512" />},
  { label: 'Security', icon: <Iconify icon="line-md:security-twotone" width="24" height="24" /> },
];

export const SellerSettingsView = () => {
  const settings = useSettingsContext();
  const [currentTap, setCurrentTap] = useState('Notifications');
  const { user } = useAuthContext();
  

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Account Settings
      </Typography>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 5 }}>
        Home &gt; Settings
      </Typography>

      <Grid container spacing={3}>
        {/* Sidebar */}
        <Grid item xs={12} md={3}>
          <Card>
            <List>
              {tabs.map((tab, index) => (
                <ListItemButton
                  key={index}
                  selected={tab.label === currentTap}
                  onClick={() => setCurrentTap(tab.label)}
                  sx={{
                    ...(tab.label === currentTap && {
                      bgcolor: 'action.selected',
                      color: 'primary.main',
                    })
                  }}
                  
                >
                  <ListItemIcon>{tab.icon}</ListItemIcon>
                  <MUIListItemText primary={tab.label} />
                </ListItemButton>
              ))}
            </List> 
          </Card>
        </Grid>

        <Grid item xs={12} md={9}>
          {currentTap === 'Notifications' && <NotificationsSettings />}
          {currentTap === 'Account' && <AccountSettings />}
          {currentTap === 'Security' && <SecuritySettings />}
          {currentTap === 'Payment Methods' && <PaymentMethods />}
          {currentTap === 'Shipping' && <ShippingAddress />}
          {currentTap === 'Store Information' && <StoreInformation   />}
        </Grid>
      </Grid>
    </Container>
  );
};
