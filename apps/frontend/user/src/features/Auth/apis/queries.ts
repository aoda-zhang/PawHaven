import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import type { AuthFieldType, LoginInfo } from '../types';

import * as AuthAPI from './requests';

import { useReduxDispatch } from '@/hooks/reduxHooks';
import { setUserInfo } from '@/store/globalReducer';

export const useLogin = () => {
  const navigate = useNavigate();
  const dispatch = useReduxDispatch();
  return useMutation<LoginInfo, Error, AuthFieldType>({
    mutationFn: (userInfo: AuthFieldType) => AuthAPI.login(userInfo),
    onSuccess: (loginInfo) => {
      if (loginInfo?.baseUserInfo) {
        dispatch(setUserInfo(loginInfo?.baseUserInfo));
        navigate('/');
      }
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const dispatch = useReduxDispatch();
  return useMutation<LoginInfo, Error, AuthFieldType>({
    mutationFn: (userInfo: AuthFieldType) => AuthAPI.register(userInfo),
    onSuccess: (loginInfo) => {
      if (loginInfo?.baseUserInfo) {
        dispatch(setUserInfo(loginInfo?.baseUserInfo));
        navigate('/');
      }
    },
  });
};
