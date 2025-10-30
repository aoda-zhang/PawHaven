export type UserInfoType = {
  userName: string;
  userID: string;
  globalMenuUpdateAt: string;
  globalRouterUpdateAt: string;
  [key: string]: unknown;
};

export type AuthFieldType = {
  userName?: string;
  password?: string;
  phoneNumber?: string;
};
export type LoginInfo = {
  baseUserInfo: UserInfoType;
};
