import React, { useState } from 'react';
import styled from '@emotion/styled';
import debounce from 'lodash/debounce';
import { AutoComplete } from 'src/components';
import { Input } from 'antd';
import { AccessOption, Permission } from '../types';
import { formAccessOptionLabel } from '../utils';

const SEARCH_DELAY = 500;

const StyledAutoComplete = styled(AutoComplete)`
  margin: 10px 16px;
  width: calc(100% - 32px);
`;

const AccessOptionSearch = ({
  getOptions,
  addNewAccessOption,
  placeholder,
  dangerMessage,
}: {
  getOptions: (value: string) => Promise<Omit<AccessOption, 'permission'>[]>;
  addNewAccessOption: (
    accessOption: AccessOption,
    dangerMessage: string,
  ) => void;
  placeholder: string;
  dangerMessage: string;
}) => {
  const [accessOptions, setAccessOptions] = useState<
    Omit<AccessOption, 'permission'>[]
  >([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const selectOptions = accessOptions.map(accessOption => ({
    value: accessOption.id,
    label: formAccessOptionLabel(accessOption),
    accessOption,
  }));

  const handleDebouncedSearch = debounce(async (value: string) => {
    if (value.length >= 3) {
      setIsLoading(true);
      const options = await getOptions(value);
      setAccessOptions(options);
      setIsLoading(false);
    }
  }, SEARCH_DELAY);

  const handleSelect: (value: string, option: any) => void = (
    value,
    option,
  ) => {
    addNewAccessOption(
      { ...option.accessOption, permission: Permission.Read },
      dangerMessage,
    );
    setSearch('');
  };

  return (
    <StyledAutoComplete
      value={search}
      options={selectOptions}
      onSearch={handleDebouncedSearch}
      onSelect={handleSelect}
      onChange={setSearch}
    >
      <Input.Search
        placeholder={placeholder}
        loading={isLoading}
        allowClear
        size="middle"
      />
    </StyledAutoComplete>
  );
};

export default AccessOptionSearch;
