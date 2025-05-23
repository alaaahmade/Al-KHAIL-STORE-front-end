'use client';

// auth
import { GuestGuard } from 'src/auth/guard';
// components
import AuthClassicLayout from 'src/layouts/auth/classic';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

import { PublicResetProvider } from 'src/auth/context/jwt/public-reset-context';

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <PublicResetProvider>
        <AuthClassicLayout>{children}</AuthClassicLayout>
      </PublicResetProvider>
    </GuestGuard>
  );
}
