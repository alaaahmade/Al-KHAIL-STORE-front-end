import { RoleBasedGuard } from '@/auth/guard';
import AnalyticsDashboard from '@/sections/analytics/AnalyticsDashboard';

export const metadata = {
  title: 'Dashboard: Analytics',
};

export default function AnalyticsPage() {
  return (
    <RoleBasedGuard roles={['ADMIN', 'SELLER']}>
      <AnalyticsDashboard />
    </RoleBasedGuard>
  );
}
