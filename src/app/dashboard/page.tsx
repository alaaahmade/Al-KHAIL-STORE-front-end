// sections
'use client';
import { RoleBasedGuard } from '@/auth/guard';
import { useAuthContext } from '@/auth/hooks';
import { redirect } from 'next/navigation';
import OneView from 'src/sections/dashboard/view/view';

// ----------------------------------------------------------------------

export default function Page() {
  const {user} = useAuthContext()

  if(user?.role === 'SELLER') redirect('analytics')

  return <RoleBasedGuard roles={['ADMIN', 'SELLER']}>
    <OneView />
  </RoleBasedGuard>;
}
