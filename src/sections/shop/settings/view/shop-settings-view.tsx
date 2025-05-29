'use client';

import React, { useCallback, useEffect } from 'react';
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

import { useSettingsContext } from 'src/components/settings';
import Iconify from '@/components/iconify';
import NotificationsSettings from '../notifications-content';
import AccountSettings from '../AccountSettings';
import SecuritySettings from '../SecuritySettings';
import PaymentMethods from '../PaymentMethods';
import ShippingAddress from '../ShippingAddress';
import { useRouter, useSearchParams } from 'next/navigation';

const tabs = [
  { label: 'Account', icon: <Iconify icon="material-symbols:person" width="24" height="24" /> },
  {
    label: 'Notifications',
    icon: <Iconify icon="mingcute:notification-fill" width="24" height="24" />,
  },
  {
    label: 'Payment Methods',
    icon: <Iconify icon="fluent:payment-16-filled" width="24" height="24" />,
  },
  { label: 'Shipping', icon: <Iconify icon="fa-solid:shipping-fast" width="24" height="24" /> },
  { label: 'Security', icon: <Iconify icon="line-md:security-twotone" width="24" height="24" /> },
];

export const ShopSettingsView = () => {
  const settings = useSettingsContext();
  const searchParams = useSearchParams();
  const tapSearch = searchParams.get('tapSearch');
  const router = useRouter();

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tapSearch', newValue);
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (!tapSearch) {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tapSearch', 'Account');
      router.push(`?${params.toString()}`);
    }
  }, [router, searchParams, tapSearch]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Account Settings
      </Typography>
      <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
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
                  selected={tab.label === tapSearch}
                  onClick={(e) => handleChangeTab(e, tab.label)}
                  sx={{
                    ...(tab.label === tapSearch && {
                      bgcolor: 'action.selected',
                      color: 'primary.main',
                    }),
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
          {tapSearch === 'Notifications' ? (
            <NotificationsSettings />
          ) : tapSearch === 'Security' ? (
            <SecuritySettings />
          ) : tapSearch === 'Payment Methods' ? (
            <PaymentMethods />
          ) : tapSearch === 'Shipping' ? (
            <ShippingAddress />
          ) : (
            <AccountSettings />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
