import { useMemo } from 'react';
// routes
import { paths } from 'src/routes/paths';
// components
import SvgColor from 'src/components/svg-color';
import { Icon } from '@iconify/react';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  user: icon('ic_user'),
  ecommerce: icon('ic_ecommerce'),
  customers: <Icon icon="fa6-solid:user-group" width="400" height="400" />,
  dashboard: <Icon icon="carbon:analytics" width="32" height="32" />,
  plans: <Icon icon="stash:plan" width="24" height="24" />,
  advertisements: <Icon icon="entypo:blackboard" width="20" height="20" />,
  category: <Icon icon="carbon:collapse-categories" width="32" height="32" />,
  interests: <Icon icon="material-symbols:interests-outline" width="24" height="24" />,
  products : <Icon icon="ix:product" width="512" height="512" />,
  orders: <Icon icon="mdi:cart" width="24" height="24" />
};

// ----------------------------------------------------------------------

export function useNavData() {
  const data = useMemo(
    () => [
      // OVERVIEW
      {
        subheader: 'MANAGEMENT',
        items: [
          { title: 'Dashboard', path: paths.dashboard.root, icon: ICONS.dashboard },
          { title: 'Products', path: paths.dashboard.products, icon: ICONS.products },
          { title: 'Orders', path: paths.dashboard.orders.root, icon: ICONS.orders },
          { title: 'Customers', path: paths.dashboard.customers, icon: ICONS.customers },
          { title: 'Advertisements', path: paths.dashboard.advertisements, icon: ICONS.advertisements },
          { title: 'Categories', path: paths.dashboard.categories, icon: ICONS.category },
          { title: 'Interests', path: paths.dashboard.interests, icon: ICONS.interests,  },
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

  return data;
}
