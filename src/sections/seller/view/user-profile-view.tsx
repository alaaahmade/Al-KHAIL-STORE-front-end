'use client';

import StoreLastReviews from './StoreLastReviews';

import { useState, useCallback, useEffect } from 'react';
// @mui
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
// routes
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';
import ProfileCover from '../profile-cover';
import ProfileGallery from '../profile-gallery';
import { useAuthContext } from '@/auth/hooks';
import { SplashScreen } from 'src/components/loading-screen';
import { fetchSellerStore } from '@/redux/slices/SellersSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'Products',
    label: 'Products',
  },
  {
    value: 'Reviews',
    label: 'Reviews',
  },
];

// ----------------------------------------------------------------------

export default function UserProfileView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const [store, setStore] = useState<any>(null)
  const {sellerStore, loadingB} = useAppSelector(store => store.SellersSlice)
  const dispatch = useAppDispatch()

  const [currentTab, setCurrentTab] = useState('Products');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  useEffect(() => {
    if(user && user.id){
      dispatch(fetchSellerStore(user?.seller?.id))
    }
  }, [user, dispatch])

  useEffect(() => {
    if(sellerStore)
    setStore(sellerStore)
  }, [user, sellerStore])

  if(loadingB) return <SplashScreen/>

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        bgcolor: 'rgba(229, 231, 235, 0.15)'
      }}
    >

      <Card
        sx={{
          mb: 1,
          height: 300,
        }}
      >
        <ProfileCover
          name={store?.name}
          avatarUrl={store?.logo}
          totalReview={Number(store?.totalReview).toFixed(1)}
          totalProducts= {store?.products?.length || 0}
          numberOfReviews={store?.products?.length || 0}
          totalFollowers= {12000}
        />
      </Card>

      <Card
        sx={{
          width: 1,
          p: 2
        }}
      >
      <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: 'flex-start',
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'Products' && store?.products &&  <ProfileGallery products={store?.products} />}

{currentTab === 'Reviews' && store?.products && (
  <StoreLastReviews products={store.products} max={5} />
)}
    </Container>
  );
}
