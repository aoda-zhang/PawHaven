import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/material';
import FormInput from '@shared/components/Form/FormInput';
import classNames from 'classnames';
import { memo, useEffect, useMemo } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import styles from '../tripLayout.module.css';
import { setStep, setTripBasic, useTripState } from '../tripReducer';

import { getTripBasicSchema, Step1FormMapping, TripBasic } from './validation';

import TransportRadio from '@/components/TransportRadio';
import { useReduxDispatch } from '@/hooks/reduxHooks';

const Step1 = () => {
  const { t } = useTranslation();
  const navagate = useNavigate();
  const dispatch = useReduxDispatch();
  const tripBasicSchema = useMemo(() => getTripBasicSchema(t), [t]);
  const { tripInfo } = useTripState();
  const formProps = useForm<TripBasic>({
    defaultValues: tripInfo?.tripBasic,
    resolver: zodResolver(tripBasicSchema),
  });

  useEffect(() => {
    dispatch(setStep({ step: 1 }));
  }, [dispatch]);

  const onSubmit: SubmitHandler<TripBasic> = (data) => {
    dispatch(setTripBasic(data));
    navagate('/trip/detail');
  };
  return (
    <FormProvider {...formProps}>
      <form className={styles.record}>
        <FormInput
          className={styles.baseForm}
          name={Step1FormMapping.TripName}
          label={t('trip.trip_name')}
        />
        <FormInput
          className={styles.baseForm}
          name={Step1FormMapping.Destination}
          label={t('trip.destination')}
        />
        <FormInput
          className={styles.baseForm}
          name={Step1FormMapping.Participants}
          label={t('trip.numOfTravelers')}
        />
        <TransportRadio />
      </form>
      <Button
        className={classNames([styles.buttons, styles.baseButton])}
        type="submit"
        variant="contained"
        color="primary"
        onClick={formProps?.handleSubmit(onSubmit)}
      >
        {t('common.save_continue')}
      </Button>
    </FormProvider>
  );
};

export default memo(Step1);
