import LocaleKeys from '@pawhaven/shared-frontend/constants/localeKey';
import storageTool from '@pawhaven/shared-frontend/utils/storage';
import { createSlice } from '@reduxjs/toolkit';

import { useReduxSelector } from '../hooks/reduxHooks';

import reducerNames from './reducerNames';
import type { ReduxState } from './reduxStore';

import storageKeys from '@/constants/StorageKeys';
import type { UserInfoType } from '@/features/Auth/types';

export interface GlobalStateType {
  userInfo: UserInfoType;
  locale: string;
}
const initialState: GlobalStateType = {
  userInfo: {
    userName: '',
    userID: '',
    globalMenuVersion: '',
    globalRouterVersion: '',
  },
  locale: storageTool.get(storageKeys.I18NKEY) || LocaleKeys['en-US'],
};

const globalReducer = createSlice({
  name: reducerNames.global,
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
  },
});
export default globalReducer.reducer;

export const { setUserInfo } = globalReducer.actions;
export const useGlobalState = () => {
  return useReduxSelector(
    (state: ReduxState) => state?.global ?? {},
  ) as GlobalStateType;
};
