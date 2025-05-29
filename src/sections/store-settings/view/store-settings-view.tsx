'use client';

import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import { toast } from 'react-toastify';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchUserSettings, updateUserStore } from '@/redux/slices/userSlice';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'store_information',
    label: 'Store Information',
    icon: <Iconify icon="solar:shop-bold" />,
  },
  { value: 'account', label: 'Account', icon: <Iconify icon="solar:user-bold" /> },
  { value: 'payment_methods', label: 'Payment Methods', icon: <Iconify icon="solar:card-bold" /> },
  { value: 'shipping', label: 'Shipping', icon: <Iconify icon="solar:delivery-bold" /> },
  { value: 'notifications', label: 'Notifications', icon: <Iconify icon="solar:bell-bing-bold" /> },
  { value: 'security', label: 'Security', icon: <Iconify icon="solar:shield-check-bold" /> },
];

const updateSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  logo: Yup.string().nullable(),
  tagline: Yup.string().nullable(),
  storeType: Yup.string().required('Store type is required'),
  description: Yup.string().required('Description is required'),
  businessHours: Yup.object().shape({
    monday: Yup.string().required('Business hours for Monday are required'),
    tuesday: Yup.string().required('Business hours for Tuesday are required'),
    wednesday: Yup.string().required('Business hours for Wednesday are required'),
    thursday: Yup.string().required('Business hours for Thursday are required'),
    friday: Yup.string().required('Business hours for Friday are required'),
    saturday: Yup.string().required('Business hours for Saturday are required'),
    sunday: Yup.string().required('Business hours for Sunday are required'),
  }),
  socialLinks: Yup.object().shape({
    instagram: Yup.string().nullable(),
    facebook: Yup.string().nullable(),
    tiktok: Yup.string().nullable(),
  }),
});

// Mock data - replace with actual data fetching and state management

export function StoreSettingsView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const { userSettings } = useAppSelector((state) => state.user);
  const [currentStoreSetting, setCurrentStoreSetting] = useState({});
  const dispatch = useAppDispatch();

  const [currentTab, setCurrentTab] = useState('store_information');
  const [storeInfo, setStoreInfo] = useState({
    logo: '',
    name: '',
    tagline: '',
    storeType: '',
    description: '',
    businessHours: {
      monday: '',
      tuesday: '',
      wednesday: '',
      thursday: '',
      friday: '',
      saturday: '',
      sunday: '',
    },
    socialLinks: {
      instagram: '',
      facebook: '',
      tiktok: '',
    },
  });

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setStoreInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBusinessHoursChange = (day: string, value: string) => {
    setStoreInfo((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [day]: value,
      },
    }));
  };

  const handleSocialLinkChange = (platform: keyof typeof storeInfo.socialLinks, value: string) => {
    setStoreInfo((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleStoreTypeChange = (event: SelectChangeEvent<string>) => {
    setStoreInfo((prev) => ({
      ...prev,
      storeType: event.target.value,
    }));
  };

  const handleSaveChanges = async () => {
    // Implement save logic here
    try {
      const result = await updateSchema.validateSync(storeInfo, {
        abortEarly: false,
      });
      await dispatch(updateUserStore({ ...result, id: userSettings?.seller.store.id }));
      await dispatch(fetchUserSettings(user?.id));
      toast.success('Changes saved successfully');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.errors.forEach((err: any) => {
          toast.error(err);
        });
      } else {
        toast.error(error.message);
      }
      return;
    }

    // You would typically make an API call here
  };

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchUserSettings(user.id));
    }
  }, [user, dispatch]);

  useEffect(() => {
    setCurrentStoreSetting((prev) => ({
      ...prev,
      ...userSettings,
    }));
    setStoreInfo((prev) => ({
      ...prev,
      ...userSettings?.seller?.store,
    }));
  }, [userSettings]);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{ bgcolor: 'f9fafb', position: 'relative' }}
    >
      <Stack direction={'row'} alignItems="flex-start" justifyContent="space-between" mb={5}>
        <Box>
          <CustomBreadcrumbs heading="Store Settings" links={[]} sx={{ mb: 0 }} />
          <Typography m={0} variant="caption">
            Manage your store preferences and account settings
          </Typography>
        </Box>
        <LoadingButton
          size="small"
          type="submit"
          sx={{ p: 1.5, bgcolor: 'primary.main' }}
          variant="contained"
          onClick={handleSaveChanges}
        >
          Save Changes
        </LoadingButton>
      </Stack>

      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 2.5, px: 1, pb: 1, borderRadius: 2 }}>
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={currentTab}
              onChange={handleChangeTab}
              sx={{
                '& .MuiTabs-indicator': { backgroundColor: 'primary.main' },
                '& .MuiTab-root': {
                  justifyContent: 'flex-start',
                  minHeight: 48,
                  px: 2.5,
                  mb: 0.5,
                  borderRadius: 1,
                  '&.Mui-selected': {
                    backgroundColor: (theme) => theme.palette.action.selected,
                    color: 'primary.main',
                    fontWeight: 'fontWeightBold',
                  },
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.action.hover,
                  },
                },
              }}
            >
              {TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          {currentTab === 'store_information' && (
            <Stack spacing={3}>
              <Card sx={{ borderRadius: 2 }}>
                <CardHeader title="Store Information" />
                <CardContent>
                  <Stack spacing={3}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Avatar src={storeInfo.logo} sx={{ width: 80, height: 80 }} />
                      <Button variant="outlined">Change Logo</Button>
                    </Stack>

                    <Grid container spacing={2}>
                      <Grid xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="name"
                          label="Store Name"
                          value={storeInfo.name}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="tagline"
                          label="Tagline / Sub-headline"
                          value={storeInfo.tagline}
                          onChange={handleInputChange}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2}>
                      <Grid xs={12} md={6}>
                        <TextField
                          fullWidth
                          name="description"
                          label="Store Description"
                          multiline
                          rows={4}
                          value={storeInfo.description}
                          onChange={handleInputChange}
                        />
                      </Grid>
                      <Grid xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel id="store-type-label">Store Type</InputLabel>
                          <Select
                            labelId="store-type-label"
                            value={storeInfo.storeType}
                            label="Store Type"
                            onChange={handleStoreTypeChange}
                          >
                            <MenuItem value="Retail Store">Retail Store</MenuItem>
                            <MenuItem value="Online Store">Online Store</MenuItem>
                            <MenuItem value="Service Provider">Service Provider</MenuItem>
                            <MenuItem value="Other">Other</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 2 }}>
                <CardHeader title="Business Hours" />
                <CardContent>
                  <Stack spacing={2}>
                    {Object.entries(storeInfo.businessHours).map(([day, time]) => (
                      <TextField
                        key={day}
                        fullWidth
                        label={day.charAt(0).toUpperCase() + day.slice(1)}
                        value={time}
                        onChange={(e) => handleBusinessHoursChange(day, e.target.value)}
                      />
                    ))}
                  </Stack>
                </CardContent>
              </Card>

              <Card sx={{ borderRadius: 2 }}>
                <CardHeader title="Social Media Links" />
                <CardContent>
                  <Stack spacing={2}>
                    <TextField
                      fullWidth
                      label="Instagram"
                      value={storeInfo.socialLinks.instagram}
                      onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="skill-icons:instagram" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="Facebook"
                      value={storeInfo.socialLinks.facebook}
                      onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="logos:facebook" />
                          </InputAdornment>
                        ),
                      }}
                    />
                    <TextField
                      fullWidth
                      label="TikTok"
                      value={storeInfo.socialLinks.tiktok}
                      onChange={(e) => handleSocialLinkChange('tiktok', e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="logos:tiktok-icon" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          )}

          {currentTab === 'account' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader title="Account Settings" />
              <CardContent>
                <Typography>Account settings content goes here...</Typography>
                {/* Add account settings form fields here */}
              </CardContent>
            </Card>
          )}
          {currentTab === 'payment_methods' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader title="Payment Methods" />
              <CardContent>
                <Typography>Payment methods content goes here...</Typography>
                {/* Add payment methods form fields here */}
              </CardContent>
            </Card>
          )}
          {currentTab === 'shipping' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader title="Shipping Settings" />
              <CardContent>
                <Typography>Shipping settings content goes here...</Typography>
                {/* Add shipping settings form fields here */}
              </CardContent>
            </Card>
          )}
          {currentTab === 'notifications' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader title="Notification Settings" />
              <CardContent>
                <Typography>Notification settings content goes here...</Typography>
                {/* Add notification settings form fields here */}
              </CardContent>
            </Card>
          )}
          {currentTab === 'security' && (
            <Card sx={{ borderRadius: 2 }}>
              <CardHeader title="Security Settings" />
              <CardContent>
                <Typography>Security settings content goes here...</Typography>
                {/* Add security settings form fields here */}
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
