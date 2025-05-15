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
  persons: <Icon icon="fontisto:persons" width="14" height="14" />,
  analytics: <Icon icon="streamline:money-graph-analytics-business-product-graph-data-chart-analysis" width="14" height="14" />,
  store: <Icon icon="fa6-solid:store" width="14" height="14" />,
  settings: <Icon icon="carbon:settings" width="14" height="14" />,
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
          // { title: 'Customers', path: paths.dashboard.customers, icon: ICONS.customers },
          // { title: 'Advertisements', path: paths.dashboard.advertisements, icon: ICONS.advertisements },
          // { title: 'Categories', path: paths.dashboard.categories, icon: ICONS.category },
          // { title: 'Interests', path: paths.dashboard.interests, icon: ICONS.interests,  },
          { title: 'User MANAGEMENT', path: paths.dashboard.user.list , icon: ICONS.persons },
          { title: 'Merchant MANAGEMENT', path: paths.dashboard.Merchant , icon: ICONS.store },
          { title: 'Settings', path: paths.dashboard.settings, icon: ICONS.settings },
        ],
      },

      // MANAGEMENT
      {
        subheader: 'management',
        items: [
          {
            title: 'Users',
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            children: [
              { title: 'List', path: paths.dashboard.user.list },
              { title: 'Create', path: paths.dashboard.user.create },
              { title: 'Roles', path: paths.dashboard.user.role.list },
              { title: 'Permissions', path: paths.dashboard.user.permission.list },
            ],
          },
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
          { title: 'Contact Management', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'Store Settings', path: paths.dashboard.analytics.root, icon: ICONS.analytics },
          { title: 'Store', path: paths.dashboard.orders.root, icon: ICONS.orders },
          {title: 'Account Settings', path:  paths.dashboard.reviews.root, icon: ICONS.Reviews},
        ],
      },
    ],
    []
  );

  return user?.role.toLowerCase(  ) === 'admin' ? AdminData : user?.role.toLowerCase(  ) === 'seller' ? SellerData : [];
}
