import { RoleBasedGuard } from '@/auth/guard';
import SellerProductsListView from '@/sections/products/view/seller-products-listview';

export const metadata = {
  title: 'Dashboard: Products',
};

export default function ProductsListPage() {
  return (
    <RoleBasedGuard roles={['ADMIN', 'SELLER']}>
      <SellerProductsListView />
    </RoleBasedGuard>
  );
}
