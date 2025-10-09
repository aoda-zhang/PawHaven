import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { useFetchLatestRescuesByNumber } from '../apis/queries';
import { RescueItemType } from '../types';

import getStatusColorByPrefix from '@/utils/getStatusColorByPrefix';

const RescueItem = ({
  animalID,
  name,
  img,
  description,
  location,
  time,
  status,
}: RescueItemType) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/rescue/detail/${animalID}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className="flex flex-col gap-1 p-4 mb-4 border-1 border-border rounded-md bg-white cursor-pointer"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <img src={img} alt={name} className="rounded-md w-full h-3/4 mb-3" />
      <p className="text-xl text-primary">{name}</p>
      <p className="flex justify-between text-sm text-text-secondary">
        <span>{location}</span>
        <span>{time}</span>
      </p>
      <p className="text-text-secondary">{description}</p>
      <div
        className={clsx([
          'rounded-full text-center text-white py-2',
          getStatusColorByPrefix({ status, prefix: 'bg' }),
        ])}
      >
        {t(`common.rescue_status_${status}`)}
      </div>
    </div>
  );
};

const LatestRescue = () => {
  const { t } = useTranslation();
  const { data: rescues } = useFetchLatestRescuesByNumber();

  const handleViewAllClick = () => {
    // TODO: Navigate to the appropriate page for viewing all rescues
    // navigate('/rescues');
  };

  const handleViewAllKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleViewAllClick();
    }
  };

  return (
    <div className="px-4 lg:px-20">
      <div className="flex items-center justify-between my-4">
        <span className="text-base lg:text-2xl font-bold">
          {t('common.recent_rescue')}
        </span>
        <div
          className="flex items-center gap-4"
          role="button"
          tabIndex={0}
          onClick={handleViewAllClick}
          onKeyDown={handleViewAllKeyDown}
        >
          <span>{t('common.view_all')}</span>
          <ArrowRight
            size="1.875rem"
            className="text-white bg-primary rounded-full"
          />
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(14rem,1fr))] gap-4">
        {rescues?.map((item) => (
          <RescueItem {...item} key={item.name} />
        ))}
      </div>
    </div>
  );
};

export default LatestRescue;
