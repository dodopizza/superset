// DODO was here

import React, {
  ChangeEventHandler,
  FocusEvent,
  KeyboardEvent,
  useCallback,
  useState,
} from 'react';
import { t, styled } from '@superset-ui/core';
import { Input } from 'src/components/Input';
import { Tooltip } from 'src/components/Tooltip';

const TitleLabel = styled.span`
  display: inline-block;
  padding: 2px 0;
`;

const TitleLabelOnEdit = styled.span`
  display: inline-block;
  padding: 2px 0;
  text-transform: uppercase;
`;

const TitlesWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: row;
  margin-bottom: 8px;

  span {
    margin-left: 12px;

    &:first-child {
      margin-left: 0;
    }
  }
`;

const StyledInput = styled(Input)`
  border-radius: ${({ theme }) => theme.borderRadius};
  height: 26px;
  padding-left: ${({ theme }) => theme.gridUnit * 2.5}px;
`;

export interface AdhocMetricEditPopoverTitleProps {
  title?: {
    label?: string;
    labelRU?: string;
    hasCustomLabel?: boolean;
  };
  isEditDisabled?: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onChangeRU: ChangeEventHandler<HTMLInputElement>;
}

const SYSTEM_LANGUAGES = {
  ru: 'ru',
  en: 'en',
};

const AdhocMetricEditPopoverTitle: React.FC<AdhocMetricEditPopoverTitleProps> =
  ({ title, isEditDisabled, onChange, onChangeRU }) => {
    console.log('title!!!', title);
    const [isHovered, setIsHovered] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editLang, setEditLang] = useState(SYSTEM_LANGUAGES.en);

    const defaultLabel = t('My metric');
    const defaultLabelRU = t('Моя метрика');

    const handleMouseOver = useCallback(() => setIsHovered(true), []);
    const handleMouseOut = useCallback(() => setIsHovered(false), []);
    const handleClick = useCallback((lang: string) => {
      setEditLang(lang);
      setIsEditMode(true);
    }, []);
    const handleBlur = useCallback(() => setIsEditMode(false), []);
    const handleBlurRU = useCallback(() => setIsEditMode(false), []);

    const handleKeyPress = useCallback(
      (ev: KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          handleBlur();
        }
      },
      [handleBlur],
    );

    const handleKeyPressRU = useCallback(
      (ev: KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          handleBlurRU();
        }
      },
      [handleBlurRU],
    );

    const handleInputBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
          onChange(e);
        }

        handleBlur();
      },
      [onChange, handleBlur],
    );

    const handleInputBlurRU = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
          onChangeRU(e);
        }

        handleBlurRU();
      },
      [onChangeRU, handleBlurRU],
    );

    if (isEditDisabled) {
      return (
        <div>
          <span data-test="AdhocMetricTitle">
            {title?.label || defaultLabel}
          </span>
          <span data-test="AdhocMetricTitleRU">
            {title?.labelRU || defaultLabelRU}
          </span>
        </div>
      );
    }

    if (isEditMode && editLang) {
      return (
        <div>
          <TitleLabelOnEdit>{editLang}:</TitleLabelOnEdit>
          {editLang === SYSTEM_LANGUAGES.en && (
            <StyledInput
              type="text"
              placeholder={title?.label}
              value={title?.hasCustomLabel ? title.label : ''}
              autoFocus
              onChange={onChange}
              onBlur={handleInputBlur}
              onKeyPress={handleKeyPress}
              data-test="AdhocMetricEditTitle#input"
            />
          )}
          {editLang === SYSTEM_LANGUAGES.ru && (
            <StyledInput
              type="text"
              placeholder={title?.labelRU}
              value={title?.hasCustomLabel ? title.labelRU : ''}
              autoFocus
              onChange={onChangeRU}
              onBlur={handleInputBlurRU}
              onKeyPress={handleKeyPressRU}
              data-test="AdhocMetricEditTitleRU#input"
            />
          )}
        </div>
      );
    }

    return (
      <TitlesWrapper>
        <TitleWrapper>
          <TitleLabel>EN:</TitleLabel>
          <Tooltip
            placement="top"
            title={`Click to edit label (${SYSTEM_LANGUAGES.en})`}
          >
            <span
              className="AdhocMetricEditPopoverTitle inline-editable"
              data-test="AdhocMetricEditTitle#trigger"
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={() => handleClick(SYSTEM_LANGUAGES.en)}
              onBlur={handleBlur}
              role="button"
              tabIndex={0}
            >
              <TitleLabel>{title?.label || defaultLabel}</TitleLabel>
              &nbsp;
              <i
                className="fa fa-pencil"
                style={{ color: isHovered ? 'black' : 'grey' }}
              />
            </span>
          </Tooltip>
        </TitleWrapper>
        <TitleWrapper>
          <TitleLabel>RU:</TitleLabel>
          <Tooltip
            placement="top"
            title={`Click to edit label (${SYSTEM_LANGUAGES.ru})`}
          >
            <span
              className="AdhocMetricEditPopoverTitle inline-editable"
              data-test="AdhocMetricEditTitle#trigger"
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              onClick={() => handleClick(SYSTEM_LANGUAGES.ru)}
              onBlur={handleBlurRU}
              role="button"
              tabIndex={0}
            >
              <TitleLabel>{title?.labelRU || defaultLabelRU}</TitleLabel>
              &nbsp;
              <i
                className="fa fa-pencil"
                style={{ color: isHovered ? 'black' : 'grey' }}
              />
            </span>
          </Tooltip>
        </TitleWrapper>
      </TitlesWrapper>
    );
  };

export default AdhocMetricEditPopoverTitle;
