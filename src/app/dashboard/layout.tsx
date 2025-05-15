'use client';

// auth
import { AuthGuard } from 'src/auth/guard';
// components
import DashboardLayout from 'src/layouts/dashboard';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthGuard>
  );
}
