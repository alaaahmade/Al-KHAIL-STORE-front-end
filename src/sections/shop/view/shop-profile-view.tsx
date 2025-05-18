'use client';

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
import ShopAboutSection from '../shop-about-section';
import ShopPoliciesSection from '../shop-policies-section';
import ShopContactSection from '../shop-contact-section';
import { useAuthContext } from '@/auth/hooks';
import { SplashScreen } from 'src/components/loading-screen';
import { fetchShopeProfile } from '@/redux/slices/SellersSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useParams } from 'next/navigation';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'Products',
    label: 'Products',
  },
  {
    value: 'About',
    label: 'About',
  },
  {
    value: 'Policies',
    label: 'Policies',
  },
];

const getStoreAverageRating = (store: any) => {
  let totalRating = 0;
  let totalComments = 0;

  store?.products?.forEach((product: any) => {
    product?.comments?.forEach((comment: any) => {
      totalRating += comment.rating;
      totalComments++;
    });
  });

  return totalComments > 0 ? totalRating / totalComments : 0;
};
// ----------------------------------------------------------------------

export default function ShopProfileView() {
  const settings = useSettingsContext();
  const { user } = useAuthContext();
  const [store, setStore] = useState<any>(null)
  const {shop, loadingB} = useAppSelector(store => store.SellersSlice)
  const {shopId} = useParams()
  const dispatch = useAppDispatch()

  console.log(store);
  console.log(shopId);
  
  

  const [searchFriends, setSearchFriends] = useState('');

  const [currentTab, setCurrentTab] = useState('Products');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  useEffect(() => {
    if(user && user.id){
      dispatch(fetchShopeProfile(shopId))
    }
  }, [ dispatch, shopId])

  useEffect(() => {
    if(shop)
    setStore(shop)
  }, [user, shop])

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
          totalReview={Number(getStoreAverageRating(store)).toFixed(1)}
          totalProducts={String(store?.products?.length || 0)}
          numberOfReviews={store?.products?.length || 0}
          totalFollowers={String(12000)}
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
          centered
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            pl:2,
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              justifyContent: 'flex-start',
            },
            [`& .MuiTab-root`]: {
              color: '#6B7280',
              fontWeight: 600,
              fontSize: 16,
              '&.Mui-selected': {
                color: '#EC4899',
              },
            },
            [`& .MuiTabs-indicator`]: {
              backgroundColor: '#EC4899',
              height: 3,
              borderRadius: 2,
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value}label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'About' && <ShopAboutSection />}
      {currentTab === 'Reviews' && <div>Reviews section coming soon.</div>}
      {currentTab === 'Products' && store?.products && <ProfileGallery products={store?.products} />}
      {currentTab === 'Policies' && <ShopPoliciesSection />}
      {currentTab === 'Contact' && <ShopContactSection />}
    </Container>
  );
}

