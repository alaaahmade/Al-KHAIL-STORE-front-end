import { RoleBasedGuard } from '@/auth/guard';
import UserProfileView from '@/sections/seller/view/user-profile-view';

export default function StorePage() {
  return (
    <RoleBasedGuard roles={['SELLER']}>
      <UserProfileView />
    </RoleBasedGuard>
  );
}
