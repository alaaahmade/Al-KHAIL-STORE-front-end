'use client';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/utils/stripe';
import { ShopSettingsView } from '@/sections/shop/settings/view/shop-settings-view';

export default function SettingsPage() {
  return (
    <Elements stripe={stripePromise}>
      <ShopSettingsView />
    </Elements>
  );
}
