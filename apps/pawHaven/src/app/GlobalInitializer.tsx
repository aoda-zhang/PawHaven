import Loading from '@shared/components/Loading';
import { useEffect } from 'react';

import {
  useFetchGlobalMenu,
  useFetchGlobalRouters,
} from '@/features/Home/apis/queries';
import { useReduxDispatch } from '@/hooks/reduxHooks';
import { setGlobalMenuItems, setGlobalRouters } from '@/store/globalReducer';

/**
 *
 * This component is responsible for fetching and initializing global data required across the application.
 * It triggers the fetching of dynamic global menu and router configurations from the API.
 * The component does not render any UI elements and returns null.
 *
 * It is intended to be included at a high level in the component tree, such as in the main layout or App component,
 * to ensure that global data is available throughout the application.
 *
 * @returns {null} - This component does not render any UI elements.
 */
const GlobalInitializer = () => {
  const dispatch = useReduxDispatch();

  const { data: menu, isLoading: menuLoading } = useFetchGlobalMenu();

  const { data: routers, isLoading: routersLoading } = useFetchGlobalRouters();

  useEffect(() => {
    if (menu && menu?.length > 0) {
      dispatch(setGlobalMenuItems(menu));
    }
  }, [menu, dispatch]);

  useEffect(() => {
    if (routers && routers?.length > 0) {
      dispatch(setGlobalRouters(routers));
    }
  }, [routers, dispatch]);

  if (menuLoading || routersLoading) return <Loading />;
  return null;
};

export default GlobalInitializer;
