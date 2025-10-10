import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  type CheckboxProps,
} from '@mui/material';
import clsx from 'clsx';
import type { FC } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import type { BaseFormType } from '../formBase.type';

const FormCheckbox: FC<BaseFormType & CheckboxProps> = ({
  name,
  label,
  defaultValue = false,
  ...props
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <div className={clsx([props?.className, 'baseFormContainer'])}>
          <FormControlLabel
            control={
              <Checkbox
                {...field}
                {...props}
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            }
            label={label}
          />
          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </div>
      )}
    />
  );
};

export default FormCheckbox;
