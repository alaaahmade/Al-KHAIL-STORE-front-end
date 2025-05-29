'use client';

import { RoleBasedGuard } from '@/auth/guard';
import ProductCreateView from '@/sections/products/view/service-create-view';

export default function ServicesListPage() {
  return (
    <RoleBasedGuard roles={['ADMIN', 'SELLER']}>
      <ProductCreateView />
    </RoleBasedGuard>
  );
}
