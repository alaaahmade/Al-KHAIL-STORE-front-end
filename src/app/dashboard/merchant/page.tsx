'use client';
import { RoleBasedGuard } from '@/auth/guard';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchSellers } from '@/redux/slices/SellersSlice';
import MerchantListView from '@/sections/merchant/view/merchant-list-view';
import { useEffect } from 'react';

export default function MerchantListPage() {
  const { sellers } = useAppSelector((state) => state.SellersSlice);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSellers());
  }, [dispatch]);

  return (
    <RoleBasedGuard roles={['ADMIN']}>
      <MerchantListView sellers={sellers} />
    </RoleBasedGuard>
  );
}
