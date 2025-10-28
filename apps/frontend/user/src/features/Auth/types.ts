export type UserInfoType = {
  userName: string;
  userID: string;
  globalMenuVersion: string;
  globalRouterVersion: string;
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
