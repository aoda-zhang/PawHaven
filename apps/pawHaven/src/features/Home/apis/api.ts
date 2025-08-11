import httpService from '@shared/cores/http';

type TripViewType = {
  img: string;
  title: string;
  rows?: number;
  cols?: number;
};
export const getDefaultTripView = (): Promise<TripViewType[]> => {
  return httpService.get('document/v1/default-trip-views');
};
export const getDefaultDynamicMenu = () => {
  // return httpService.get('document/v1/default-dynamic-menu');
  // Image this data from API server side
  return [
    {
      label: 'common.record',
      to: '/trip/basic',
      classNames: ['item'],
      type: 'link',
    },
    {
      label: 'common.history',
      to: '/trip/history',
      classNames: ['item'],
      type: 'link',
    },
    {
      label: 'common.signin',
      to: '/login',
      classNames: ['item', 'login'],
      type: 'link',
    },
    {
      label: 'common.language',
      component: 'LangSwitcher',
      type: 'component',
    },
  ];
};
