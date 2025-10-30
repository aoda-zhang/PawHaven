import { Loading, SuspenseWrapper } from '@pawhaven/ui';
import type { ReactNode } from 'react';
import { Suspense, useMemo } from 'react';
import type { RouteObject } from 'react-router-dom';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { useFetchGlobalRouters } from '@/layout/RootLayoutAPI';
import routerElementMapping from '@/route/routerElementMapping';
import { useGlobalState } from '@/store/globalReducer';

export interface RouteMetaType {
  isRequireUserLogin?: boolean;
  children?: ReactNode;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routesMapping = (routesFromAPI: any[]): RouteObject[] => {
  const routes = routesFromAPI.map((route) => {
    const isLazyLoadElement = route?.handle?.isLazyLoad ?? true;
    const mappedRoute: RouteObject = {
      path: route?.path,
      element: isLazyLoadElement ? (
        <SuspenseWrapper>{routerElementMapping[route.element]}</SuspenseWrapper>
      ) : (
        routerElementMapping[route.element]
      ),
      handle: route?.handle,
      errorElement: routerElementMapping.errorFallback,
    };

    if (route?.children) {
      mappedRoute.children = routesMapping(route?.children);
    }

    return mappedRoute;
  });

  return routes;
};

const AppRouterProvider = () => {
  const { userInfo } = useGlobalState();
  const { data: globalRouters = [] } = useFetchGlobalRouters(
    userInfo?.userID,
    userInfo?.globalRouterUpdateAt,
  );
  const router = useMemo(() => {
    const mappedRoutes = routesMapping(globalRouters);
    if (mappedRoutes?.length > 0) {
      return createBrowserRouter(mappedRoutes);
    }
    return null;
  }, [globalRouters]);

  if (router) {
    return <RouterProvider router={router} />;
  }
  return <Loading />;
};

export default AppRouterProvider;
