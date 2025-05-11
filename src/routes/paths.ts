// ----------------------------------------------------------------------

import { de } from 'date-fns/locale';

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
      resetPassword: `${ROOTS.AUTH}/jwt/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    one: `${ROOTS.DASHBOARD}/one`,
    two: `${ROOTS.DASHBOARD}/two`,
    three: `${ROOTS.DASHBOARD}/three`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
    user: {
      root: '/dashboard/user',
      list: '/dashboard/user/list',
      create: '/dashboard/user/create',
      edit: (id: string) => `/dashboard/user/${id}/edit`,
      view: (id: string) => `/dashboard/user/${id}`,
      role: {
        root: '/dashboard/user/role',
        list: '/dashboard/user/role/list',
        create: '/dashboard/user/role/create',
        edit: (id: string) => `/dashboard/user/role/${id}/edit`,
      },
      permission: {
        root: '/dashboard/user/permission',
        list: '/dashboard/user/permission/list',
        create: '/dashboard/user/permission/create',
        edit: (id: string) => `/dashboard/user/permission/${id}/edit`,
      },
    },
    business: {
      root: '/dashboard/business',
      list: '/dashboard/business/list',
      create: '/dashboard/business/create',
      edit: (id: string) => `/dashboard/business/${id}/edit`,
      type: {
        root: '/dashboard/business/type',
        list: '/dashboard/business/type/list',
        create: '/dashboard/business/type/create',
        edit: (id: string) => `/dashboard/business/type/${id}/edit`,
      },
    },
    customers: '/dashboard/customers',
    transactions: '/dashboard/transactions',
    subscription: {
      root: '/dashboard/subscription',
      plans: '/dashboard/subscription/plans',
    },
    advertisements: '/dashboard/advertisements',
    categories: '/dashboard/categories',
    interests: '/dashboard/interests',
    service: {
      root: '/dashboard/services',
      list: '/dashboard/services/list',
      create: '/dashboard/services/create',
      edit: (id: string) => `/dashboard/services/${id}/edit`,
      detail: (id: string) => `/dashboard/services/${id}`,
    },
  },
  
};
