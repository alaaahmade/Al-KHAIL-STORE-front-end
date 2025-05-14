'use client';

import { useAuthContext } from '@/auth/hooks';
import { AdminDashboardLayout } from '@/layouts/dashboard/Adminlayout';
// auth
import { AuthGuard } from 'src/auth/guard';
// components

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const {user} = useAuthContext()

  console.log(user?.role);
  
  

  return (
    <AuthGuard>
      <AdminDashboardLayout>{children}</AdminDashboardLayout>
    </AuthGuard>
  );
}
