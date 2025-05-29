// sections

import { RoleBasedGuard } from '@/auth/guard';
import { StoreSettingsView } from '@/sections/store-settings/view/store-settings-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Store Settings',
};

export default function StoreSettingsPage() {
  return (
    <RoleBasedGuard roles={['SELLER']}>
      <StoreSettingsView />
    </RoleBasedGuard>
  );
}
