import { useQuery } from '@tanstack/react-query';
import type { RouteObject } from 'react-router-dom';

// Fetch menu from server side
const getDefaultDynamicMenu = () => {
  // return httpService.get('document/v1/default-dynamic-menu');
  // Image this data from API server side
  return [
    {
      label: 'common.record',
      to: '/report-stray',
      classNames: ['menuItem'],
      type: 'link',
    },
    {
      label: 'common.stories',
      to: '/rescue/story',
      classNames: ['menuItem'],
      type: 'link',
    },
    {
      label: 'common.guides',
      to: '/rescue/guides',
      classNames: ['menuItem'],
      type: 'link',
    },
    {
      label: 'auth.auth',
      to: '/auth/login',
      classNames: ['login'],
      type: 'link',
    },
    {
      label: 'common.language',
      component: 'LangSwitcher',
      type: 'component',
    },
  ];
};

// Fetch router from server side
const getDynamicRouters = () => {
  // return httpService.get('document/v1/default-dynamic-menu');
  // Image this data from API server side
  const routes = [
    {
      element: 'rootLayout',
      children: [
        {
          path: '/',
          handle: { isRequireUserLogin: false, isLazyLoad: false },
          element: 'home',
        },
        {
          path: '/report-stray',
          element: 'report_stray',
        },
        {
          path: '/rescue/guides',
          element: 'rescue_guides',
        },
        {
          path: '/rescue/detail/:animalID',
          element: 'rescue_detail',
        },
        {
          path: '/auth/login',
          handle: {
            isRequireUserLogin: false,
            isMenuAvailable: false,
            isFooterAvailable: false,
            isLazyLoad: false,
          },
          element: 'auth_login',
        },
        {
          path: '/auth/register',
          handle: {
            isRequireUserLogin: false,
            isMenuAvailable: false,
            isFooterAvailable: false,
            isLazyLoad: false,
          },
          element: 'auth_register',
        },
      ],
    },
    {
      path: '/notFund',
      element: 'notFund',
    },
  ];
  return Promise.resolve(routes);
};

export const HomeQueryKeys = {
  GET_DEFAULT_TRIP_MENU: 'GET_DEFAULT_TRIP_MENU',
  GET_DEFAULT_TRIP_ROUTER: 'GET_DEFAULT_TRIP_ROUTER',
};

export const useFetchGlobalMenu = (userID: string) => {
  return useQuery({
    queryKey: [HomeQueryKeys.GET_DEFAULT_TRIP_MENU, userID],
    queryFn: getDefaultDynamicMenu,
  });
};

export const useFetchGlobalRouters = (userID: string) => {
  return useQuery<RouteObject[]>({
    queryKey: [HomeQueryKeys.GET_DEFAULT_TRIP_ROUTER, userID],
    queryFn: getDynamicRouters,
  });
};
