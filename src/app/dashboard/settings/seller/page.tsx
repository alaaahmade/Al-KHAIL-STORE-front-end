'use client';
import { SellerSettingsView } from '@/sections/seller/settings/view/sellersettingsView';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/utils/stripe';

export default function SettingsPage() {
  return (
    <Elements stripe={stripePromise}>
      <SellerSettingsView />
    </Elements>
  );
}
