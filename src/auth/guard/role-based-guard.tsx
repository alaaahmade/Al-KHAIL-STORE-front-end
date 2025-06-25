'use client'
// @mui
import { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------

type RoleBasedGuardProp = {
  hasContent?: boolean;
  roles?: string[];
  children: React.ReactNode;
  sx?: SxProps<Theme>;
};
import { useEffect } from 'react';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from '../hooks';

export default function RoleBasedGuard({ hasContent, roles, children, sx }: RoleBasedGuardProp) {
  const { user } = useAuthContext();
  const router = useRouter();

  const allowedRoles = (roles || []).map((r) => r.toUpperCase());
  const userRoles = Array.isArray(user?.roles)
    ? user.roles.map((role: { name: string }) => role.name.toUpperCase())
    : [];

  const hasAccess = userRoles.some((role) => allowedRoles.includes(role));
  const userRole = userRoles[0]
  useEffect(() => {
    if (roles && !hasAccess) {
      if(userRoles.some(role => role === 'USER')){
        router.replace('/shop');
      }else {
        router.replace('/');

      }
      
      
    }
  }, [roles, hasAccess, router]);

  // Optionally render nothing while redirecting
  if (roles && !hasAccess) {
    return null;
  }

  return <>{children}</>;
}

