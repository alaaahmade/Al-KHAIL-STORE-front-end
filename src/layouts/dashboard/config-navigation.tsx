import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';
import { Icon } from '@iconify/react';
import { useAuthContext } from '@/auth/hooks';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  customers: <Icon icon="fa6-solid:user-group" width="14" height="14"/>,
  dashboard: <Icon icon="carbon:analytics"width="14" height="14" />,
  plans: <Icon icon="stash:plan" width="14" height="14"/>,
  advertisements: <Icon icon="entypo:blackboard" width="20" height="20" />,
  category: <Icon icon="carbon:collapse-categories" width="32" height="32" />,
  interests: <Icon icon="material-symbols:interests-outline" width="14" height="14"/>,
  products : <Icon icon="ix:product" width="512" height="512" />,
  orders: <Icon icon="mdi:cart" width="14" height="14"/>,
  Reviews: <Icon icon="fa-solid:comments" width="14" height="14" />,
  star_review: <Icon icon="solar:star-bold" width="14" height="14" />,
  persons: <Icon icon="fontisto:persons" width="14" height="14" />,
  analytics: <Icon icon="streamline:money-graph-analytics-business-product-graph-data-chart-analysis" width="14" height="14" />,
  store: <Icon icon="fa6-solid:store" width="14" height="14" />,
  settings: <Icon icon="carbon:settings" width="14" height="14" />,
  contacts: <Icon icon="lets-icons:message-alt-fill" width="14" height="14" />,
  newPage: <Icon icon="material-symbols:new-releases" width="14" height="14" />,
};

// ----------------------------------------------------------------------

export function useNavData() {
  const {user} = useAuthContext()
  
  const AdminData = useMemo(
    () => [
      // OVERVIEW
      {
        subheader: 'MANAGEMENT',
        items: [
          { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'Analytics', path: paths.dashboard.analytics.root, icon: ICONS.analytics },
          { title: 'Products', path: paths.dashboard.Products, icon: ICONS.products },
          { title: 'Orders', path: paths.dashboard.orders.root, icon: ICONS.orders },
          {title: 'Reviews', path:  paths.dashboard.reviews.root, icon: ICONS.Reviews},
          { title: 'User MANAGEMENT', path: paths.dashboard.user.list , icon: ICONS.persons },
          { title: 'Merchant MANAGEMENT', path: paths.dashboard.Merchant , icon: ICONS.store },
          { title: 'Settings', path: paths.dashboard.settings.admin, icon: ICONS.settings },
        ],
      },
    ],
    []
  );

  const SellerData = useMemo(
    () => [
      // OVERVIEW
      {
        subheader: 'MANAGEMENT',
        items: [
          { title: 'Products', path: paths.dashboard.products.root, icon: ICONS.products },
          { title: 'Contact Management', path: paths.dashboard.contactManagement.root, icon: ICONS.contacts },
          { title: 'Orders', path: paths.dashboard.orders.root, icon: ICONS.orders },
          { title: 'Reviews', path: paths.dashboard.reviews.root, icon: ICONS.star_review },
          { title: 'Analytics', path: paths.dashboard.analytics.root, icon: ICONS.analytics },
          { title: 'Settings', path: paths.dashboard.settings.seller, icon: ICONS.settings },
        ],
      },
    ],
    []
  );

  return user?.role.toLowerCase(  ) === 'admin' ? AdminData : user?.role.toLowerCase(  ) === 'seller' ? SellerData : [];
}
