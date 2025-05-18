'use client';

// auth
import { AuthGuard } from 'src/auth/guard';
// components
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShopLayout from '@/layouts/shop/shopLayout';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <ShopLayout>{children}</ShopLayout>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthGuard>
  );
}
