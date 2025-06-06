'use client';
import { SellerSettingsView } from '@/sections/seller/settings/view/sellersettingsView';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/utils/stripe';
import { RoleBasedGuard } from '@/auth/guard';

export default function SettingsPage() {
  return (
    <RoleBasedGuard roles={['SELLER']}>
    <Elements stripe={stripePromise}>
      <SellerSettingsView />
    </Elements>
    </RoleBasedGuard>
  );
}
