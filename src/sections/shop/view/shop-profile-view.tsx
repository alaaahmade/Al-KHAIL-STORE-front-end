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
import { useParams, useRouter, useSearchParams } from 'next/navigation';

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
  {
    value: 'Contact',
    label: 'Contact',
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
  const [store, setStore] = useState<any>(null);
  const { shop, loadingB, error } = useAppSelector((store) => store.SellersSlice);
  const { shopId } = useParams();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const tap = searchParams.get('tap');
  const router = useRouter();

  const handleChangeTab = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('tap', newValue);
      router.push(`?${params.toString()}`);
    },
    [searchParams, router]
  );

  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchShopeProfile(shopId));
    }
  }, [dispatch, shopId, user]);

  useEffect(() => {
    if (shop) setStore(shop);
  }, [user, shop]);

  if (loadingB) return <SplashScreen />;
  if (!store && !error) return <SplashScreen />;

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        bgcolor: 'rgba(229, 231, 235, 0.15)',
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
          totalFollowers={String(store?.followers?.length || 0)}
        />
      </Card>

      <Card
        sx={{
          width: 1,
          p: 2,
        }}
      >
        <Tabs
          value={tap}
          onChange={handleChangeTab}
          // centered
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            pl: 2,
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
            <Tab key={tab.value} value={tab.value} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {store && tap === 'About' ? (
        <ShopAboutSection />
      ) : tap === 'Policies' ? (
        <ShopPoliciesSection />
      ) : tap === 'Contact' ? (
        <ShopContactSection userID={store.seller.userId} />
      ) : (
        <ProfileGallery products={store?.products} />
      )}
    </Container>
  );
}
