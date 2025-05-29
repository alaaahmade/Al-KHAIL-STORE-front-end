'use client';

import { RoleBasedGuard } from '@/auth/guard';
import ProductEditView from '@/sections/products/view/product-edit-view';

export default function ProductEditPage() {
  return (
    <RoleBasedGuard roles={['ADMIN', 'SELLER']}>
      <ProductEditView />
    </RoleBasedGuard>
  );
}
