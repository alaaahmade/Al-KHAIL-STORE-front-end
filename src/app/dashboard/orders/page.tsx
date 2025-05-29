'use client';

import { RoleBasedGuard } from '@/auth/guard';
// sections
import OrdersView from '@/sections/orders/view/view';

// ----------------------------------------------------------------------
export default function Page() {
  return <RoleBasedGuard roles={['ADMIN', 'SELLER']}>
      <OrdersView />;
    </RoleBasedGuard>
}
