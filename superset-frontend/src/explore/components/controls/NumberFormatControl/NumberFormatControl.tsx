// DODO created file
import React from 'react';
import { t } from '@superset-ui/core';
import { Select } from 'src/components';
import { SelectProps } from 'src/components/Select/types';
import { D3_FORMAT_OPTIONS } from 'src/explore/controls';
import ControlHeader from '../../ControlHeader';

export interface NumberFormatControlProps {
  onChange: (format: string) => void;
  currencySelectOverrideProps?: Partial<SelectProps>;
}

const options = D3_FORMAT_OPTIONS.map(option => ({
  value: option[0],
  label: option[1],
}));

export const NumberFormatControl = ({
  onChange,
  currencySelectOverrideProps = {},
  ...props
}: NumberFormatControlProps) => (
  <>
    <ControlHeader {...props} />
    <Select
      ariaLabel={t('Number format')}
      options={options}
      placeholder={t('Number format')}
      onChange={onChange}
      onClear={() => onChange('')}
      allowClear
      allowNewOptions
      {...currencySelectOverrideProps}
    />
  </>
);
