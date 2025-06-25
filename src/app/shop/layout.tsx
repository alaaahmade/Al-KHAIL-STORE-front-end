'use client';

// auth
import { AuthGuard } from 'src/auth/guard';
// components
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShopLayout from '@/layouts/shop/shopLayout';
import { useAuthContext } from '@/auth/hooks';
import { redirect } from 'next/navigation';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const { user } = useAuthContext();
  const userRoles = Array.isArray(user?.roles)
  ? user.roles.map((role: { name: string }) => role.name.toUpperCase())
  : user?.role
    ? [user.role.toUpperCase()]
    : [];

    if (!userRoles.includes('USER')) {
      return redirect('/');
    }
  return (
    <AuthGuard>
      <ShopLayout>{children}</ShopLayout>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthGuard>
  );
}
