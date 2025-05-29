// sections
import { RoleBasedGuard } from '@/auth/guard';
import ReviewsView from '@/sections/reviews/view/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: One',
};

export default function Page() {
  return (
    <RoleBasedGuard roles={['ADMIN', 'SELLER']}>
      <ReviewsView />
    </RoleBasedGuard>
  );
}
