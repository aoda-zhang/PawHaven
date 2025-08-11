import storageKeys from '@shared/constants/storageKeys';
import storage from '@shared/utils/storage';
import { useMutation } from 'react-query';
import { NavigateFunction } from 'react-router-dom';

import * as AuthAPI from './apis';

export const useUserRegister = (navigate: NavigateFunction) => {
  return useMutation(AuthAPI.register, {
    onSuccess: async (isRegrester, value) => {
      if (isRegrester) {
        const loginInfo = await AuthAPI.login({
          userName: value?.userName,
          password: value?.password,
        });
        await storage.set(storageKeys.accessToken, loginInfo.accessToken);
        await storage.set(storageKeys.refreshToken, loginInfo.refreshToken);
        navigate('/trip');
      }
    },
  });
};

export const useUserLogin = (navigate: NavigateFunction) => {
  return useMutation(AuthAPI.register, {
    onSuccess: async (isRegretter, value) => {
      if (isRegretter) {
        const loginInfo = await AuthAPI.login({
          userName: value?.userName,
          password: value?.password,
        });
        await storage.set(storageKeys.accessToken, loginInfo.accessToken);
        await storage.set(storageKeys.refreshToken, loginInfo.refreshToken);
        navigate('/trip');
      }
    },
  });
};
