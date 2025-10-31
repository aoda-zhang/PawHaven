import useRouterInfo from '@pawhaven/shared-frontend/hooks/useRouterInfo';
import type { NavigateFunction, UIMatch } from 'react-router-dom';
import { Outlet, useNavigate } from 'react-router-dom';

import { useFetchGlobalMenu } from './RootLayoutAPI';
import RootLayoutFooter from './RootLayoutFooter';
import RootLayoutMenu from './RootLayoutMenu';

import { useGlobalState } from '@/store/globalReducer';
import type { MenuItemType, RouterInfoType } from '@/types/LayoutType';

export interface LayoutProps {
  menuItems: MenuItemType[];
  navigate: NavigateFunction;
  routerMatches: Array<UIMatch<unknown, unknown>>;
}

const RootLayout = () => {
  const {
    profile: { baseUserInfo },
  } = useGlobalState();
  const { data: globalMenuItems = [] } = useFetchGlobalMenu(
    baseUserInfo?.userID,
    baseUserInfo?.globalMenuUpdateAt,
  );
  const navigate = useNavigate();
  const currentRouterInfo = useRouterInfo<RouterInfoType>();
  const { isMenuAvailable = true, isFooterAvailable = true } =
    currentRouterInfo?.handle ?? {};

  return (
    <div className="flex flex-col box-border h-full min-h-dvh">
      {isMenuAvailable && globalMenuItems?.length > 0 && (
        <RootLayoutMenu
          menuItems={globalMenuItems}
          navigate={navigate}
          currentRouterInfo={currentRouterInfo}
        />
      )}

      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
        {isFooterAvailable && <RootLayoutFooter />}
      </div>
    </div>
  );
};

export default RootLayout;
