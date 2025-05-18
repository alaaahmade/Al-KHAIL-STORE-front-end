// sections
'use client';
import { useAuthContext } from '@/auth/hooks';
import { redirect } from 'next/navigation';
import OneView from 'src/sections/dashboard/view/view';

// ----------------------------------------------------------------------


export default function Page() {
  const {user} = useAuthContext()
  if(user?.role.toLowerCase() !== 'admin'){
    return redirect('/dashboard/products/')
  }
  return user?.role.toLowerCase() === 'user' ? redirect('/shop') : <OneView />;
}
