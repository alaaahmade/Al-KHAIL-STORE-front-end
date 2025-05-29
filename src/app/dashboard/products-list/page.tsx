import { RoleBasedGuard } from '@/auth/guard';
import ProductsListView from '@/sections/admin-products/view/adminProductListView';

export default function ServicesListPage() {
  return (
    <RoleBasedGuard roles={['ADMIN']}>
      <ProductsListView />
    </RoleBasedGuard>
  );
}
