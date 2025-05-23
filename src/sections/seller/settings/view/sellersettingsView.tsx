'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  Card,
  Container,
  Grid,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText as MUIListItemText,
  SelectChangeEvent,
} from '@mui/material';

import * as Yup from 'yup'

import { useSettingsContext } from 'src/components/settings';
import Iconify from '@/components/iconify';
import NotificationsSettings from '../notifications-content';
import AccountSettings from '../AccountSettings';
import SecuritySettings from '../SecuritySettings';
import PaymentMethods from '../PaymentMethods';
import ShippingAddress from '../ShippingAddress';
import StoreInformation from '../StoreInformation';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthContext } from '@/auth/hooks';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchUserSettings, updateUserStore } from '@/redux/slices/userSlice';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';


const tabs = [
  { label: 'Notifications', icon: <Iconify icon="mingcute:notification-fill" width="24" height="24" /> },
  { label: 'Account', icon: <Iconify icon="material-symbols:person" width="24" height="24" /> },
  { label: 'Payment Methods', icon: <Iconify icon="fluent:payment-16-filled" width="24" height="24" /> },
  { label: 'Shipping', icon: <Iconify icon="fa-solid:shipping-fast" width="24" height="24" /> },
  { label: 'Store Information', icon: <Iconify icon="fa6-solid:store" width="576" height="512" />},
  { label: 'Security', icon: <Iconify icon="line-md:security-twotone" width="24" height="24" /> },
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


export const SellerSettingsView = () => {
  const settings = useSettingsContext();
  const searchParams = useSearchParams()
  const tapSearch = searchParams.get('tapSearch')
  const router = useRouter()

  const { user } = useAuthContext();
  const {userSettings} = useAppSelector(state => state.user)
  const [currentStoreSetting, setCurrentStoreSetting] = useState({});
  const [errors, setErrors] = useState([]);
  const dispatch = useAppDispatch()

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

  const handleSaveChanges =async () => {
    // Implement save logic here
    try {
      const result = await updateSchema.validateSync(storeInfo, {
        abortEarly: false,
      });
      console.log('Saving changes:', result);
      await dispatch(updateUserStore({...result, id: userSettings?.seller.store.id}))
      await dispatch(fetchUserSettings(user?.id))
      toast.success('Changes saved successfully');
    }catch (error) {
      console.log(error);
      
      if (error instanceof Yup.ValidationError) {
        console.log();
        error.errors.forEach((err: any) => {
          toast.error(err);
        })
      }else{
        toast.error(error.message)
      }
      return;
    }

    // You would typically make an API call here
  };

  useEffect(()=>{
    if(user && user.id){
      dispatch(fetchUserSettings(user.id))
    }
  }, [user])

  useEffect(()=>{
    setCurrentStoreSetting(prev => ({
      ...prev,
      ...userSettings
    }))
    setStoreInfo(prev => ({
      ...prev,
      ...userSettings?.seller?.store
    }))
  }, [userSettings])

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tapSearch', newValue);
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    if(!tapSearch){
      const params = new URLSearchParams(searchParams.toString());
      params.set('tapSearch', 'Notifications');
      router.push(`?${params.toString()}`);
    }
  }, [router, searchParams, tapSearch])

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
                  selected={tab.label === tapSearch}
                  onClick={(e) => handleChangeTab(e, tab.label)}
                  sx={{
                    ...(tab.label === tapSearch && {
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
          {
            tapSearch === 'Store Information' ? <StoreInformation 
            storeInfo={storeInfo}
            handleInputChange={handleInputChange}
            handleBusinessHoursChange={handleBusinessHoursChange}
            handleSocialLinkChange={handleSocialLinkChange}
            handleStoreTypeChange={handleStoreTypeChange}
            handleSaveChanges={handleSaveChanges}
          />
            : tapSearch === 'Account' ? <AccountSettings /> 
            : tapSearch === 'Security' ? <SecuritySettings />
            : tapSearch === 'Payment Methods' ? <PaymentMethods />
            : tapSearch === 'Shipping' ? <ShippingAddress />
            : <NotificationsSettings />
        }

        </Grid>
      </Grid>
    </Container>
  );
};
