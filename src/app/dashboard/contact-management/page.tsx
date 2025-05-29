// sections
import { RoleBasedGuard } from '@/auth/guard';
import ContactManagementView from '@/sections/contact-management/view/contact-management-view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Contact Management',
};

export default function ContactManagementPage() {
  return (
    <RoleBasedGuard roles={['ADMIN']}>
      <ContactManagementView />
    </RoleBasedGuard>
  );
}
