'use client';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchSellers } from '@/redux/slices/SellersSlice';
import MerchantListView from '@/sections/merchant/view/merchant-list-view';
import { useEffect } from 'react';

export default function MerchantListPage() {
  const { sellers } = useAppSelector((state) => state.SellersSlice);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchSellers());
  }, []);

  return sellers && <MerchantListView sellers={sellers} />;
}
