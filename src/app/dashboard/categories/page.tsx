'use client';

import { RoleBasedGuard } from '@/auth/guard';
import { CatView } from 'src/sections/categories/view/view';

// sections

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <RoleBasedGuard roles={['ADMIN']}>
      <CatView />
    </RoleBasedGuard>
  );
}
