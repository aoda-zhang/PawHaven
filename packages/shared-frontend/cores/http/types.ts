export type HttpResponseType = {
  data: unknown;
  isSuccess: boolean;
  message: string | string[];
  status: number;
};
export enum commonHeader {
  'access-token' = 'access-token',
  refreshToken = 'refreshToken',
}
export enum HttpBusinessMappingCode {
  jwtexpired = 'E4001',
  unauthorized = 'Unauthorized',
}
