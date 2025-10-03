import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  type SelectProps,
} from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import type { BaseFormType, BaseSelectType } from '../formBase.type';

const FormSelect: React.FC<BaseFormType & BaseSelectType & SelectProps> = ({
  name,
  label,
  options,
  defaultValue = '',
  fullWidth = true,
  ...props
}) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState: { error } }) => (
        <FormControl
          className={clsx([props?.className, 'baseFormContainer'])}
          error={!!error}
          fullWidth={fullWidth}
        >
          <div className="mb-3">{label}</div>
          <Select
            {...field}
            {...props}
            variant={props?.variant ?? 'outlined'}
            required={props?.required}
          >
            {options?.map((item) => (
              <MenuItem key={item?.value} value={item?.value}>
                {item?.label}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>{error?.message}</FormHelperText>
        </FormControl>
      )}
    />
  );
};

export default FormSelect;
