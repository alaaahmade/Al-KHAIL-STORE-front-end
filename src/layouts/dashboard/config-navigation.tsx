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
  customers: <Icon icon="fa6-solid:user-group" width="20" height="20" />,
  dashboard: <Icon icon="carbon:analytics" width="20" height="20" />,
  plans: <Icon icon="stash:plan" width="20" height="20" />,
  advertisements: <Icon icon="entypo:blackboard" width="20" height="20" />,
  category: <Icon icon="carbon:collapse-categories" width="20" height="20" />,
  interests: <Icon icon="material-symbols:interests-outline" width="20" height="20" />,
  products: <Icon icon="fa-solid:box" width="20" height="20" />,
  orders: <Icon icon="mdi:cart" width="20" height="20" />,
  Reviews: <Icon icon="fa-solid:comments" width="20" height="20" />,
  star_review: <Icon icon="solar:star-bold" width="20" height="20" />,
  persons: <Icon icon="fontisto:persons" width="20" height="20" />,
  analytics: (
    <Icon
      icon="streamline:money-graph-analytics-business-product-graph-data-chart-analysis"
      width="20"
      height="20"
    />
  ),
  store: <Icon icon="fa6-solid:store" width="20" height="20" />,
  settings: <Icon icon="carbon:settings" width="20" height="20" />,
  contacts: <Icon icon="lets-icons:message-alt-fill" width="20" height="20" />,
  newPage: <Icon icon="material-symbols:new-releases" width="20" height="20" />,
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { user } = useAuthContext();

  const AdminData = useMemo(
    () => [
      // OVERVIEW
      {
        subheader: 'MANAGEMENT',
        items: [
          { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'Analytics', path: paths.dashboard.analytics.root, icon: ICONS.analytics },
          { title: 'Products', path: paths.dashboard.Products, icon: ICONS.products },
          { title: 'Categories', path: paths.dashboard.categories, icon: ICONS.category },
          { title: 'Orders', path: paths.dashboard.orders.root, icon: ICONS.orders },
          { title: 'Reviews', path: paths.dashboard.reviews.root, icon: ICONS.Reviews },
          { title: 'User MANAGEMENT', path: paths.dashboard.user.list, icon: ICONS.persons },
          { title: 'Merchant MANAGEMENT', path: paths.dashboard.Merchant, icon: ICONS.store },
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
          { title: 'Analytics', path: paths.dashboard.analytics.root, icon: ICONS.analytics },
          { title: 'Products', path: paths.dashboard.products.root, icon: ICONS.products },
          { title: 'Reviews', path: paths.dashboard.reviews.root, icon: ICONS.Reviews },
          {
            title: 'Contact Management',
            path: paths.dashboard.contactManagement.root,
            icon: ICONS.contacts,
          },
          { title: 'Settings', path: paths.dashboard.settings.seller, icon: ICONS.settings },
        ],
      },
    ],
    []
  );

  return Array.isArray(user?.roles) && user.roles.some((role: any) =>
    (typeof role === 'string' ? role.toUpperCase() : role.name?.toUpperCase()) === 'ADMIN'
  )
    ? AdminData
    : Array.isArray(user?.roles) && user.roles.some((role: any) =>
        (typeof role === 'string' ? role.toUpperCase() : role.name?.toUpperCase()) === 'SELLER'
      )
      ? SellerData
      : [];
}
