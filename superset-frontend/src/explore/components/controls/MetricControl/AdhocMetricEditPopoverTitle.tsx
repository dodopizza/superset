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
    labelEN?: string;
    hasCustomLabel?: boolean;
  };
  isEditDisabled?: boolean;
  // onChange: ChangeEventHandler<HTMLInputElement>;
  onChangeEN: ChangeEventHandler<HTMLInputElement>;
  onChangeRU: ChangeEventHandler<HTMLInputElement>;
}

const SYSTEM_LANGUAGES = {
  ru: 'ru',
  en: 'en',
};

const AdhocMetricEditPopoverTitle: React.FC<AdhocMetricEditPopoverTitleProps> =
  ({ title, isEditDisabled, /* onChange, */ onChangeEN, onChangeRU }) => {
    const [isHoveredEN, setIsHoveredEN] = useState(false);
    const [isHoveredRU, setIsHoveredRU] = useState(false);

    const [isEditMode, setIsEditMode] = useState(false);
    const [editLang, setEditLang] = useState(SYSTEM_LANGUAGES.en);

    const defaultLabel = t('My metric');
    const defaultLabelRU = t('Моя метрика');

    const handleMouseOverEN = useCallback(() => setIsHoveredEN(true), []);
    const handleMouseOutEN = useCallback(() => setIsHoveredEN(false), []);

    const handleMouseOverRU = useCallback(() => setIsHoveredRU(true), []);
    const handleMouseOutRU = useCallback(() => setIsHoveredRU(false), []);

    const handleClick = useCallback((lang: string) => {
      setEditLang(lang);
      setIsEditMode(true);
    }, []);

    const handleBlurEN = useCallback(() => setIsEditMode(false), []);
    const handleBlurRU = useCallback(() => setIsEditMode(false), []);

    const handleKeyPressEN = useCallback(
      (ev: KeyboardEvent<HTMLInputElement>) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          handleBlurEN();
        }
      },
      [handleBlurEN],
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

    const handleInputBlurEN = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        if (e.target.value === '') {
          onChangeEN(e);
        }

        handleBlurEN();
      },
      [onChangeEN, handleBlurEN],
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
            {title?.label || title?.labelEN || title?.labelRU || defaultLabel}
          </span>
        </div>
      );
    }

    if (isEditMode && editLang) {
      return (
        <div>
          <TitleLabelOnEdit>{editLang}:</TitleLabelOnEdit>
          {editLang === SYSTEM_LANGUAGES.en && (
            <>
              <StyledInput
                type="text"
                placeholder={title?.labelEN}
                value={title?.hasCustomLabel ? title.labelEN : defaultLabel}
                onChange={onChangeEN}
                onBlur={handleInputBlurEN}
                onKeyPress={handleKeyPressEN}
                data-test="AdhocMetricEditTitleEN#input"
              />
            </>
          )}
          {editLang === SYSTEM_LANGUAGES.ru && (
            <StyledInput
              type="text"
              placeholder={title?.labelRU}
              value={title?.hasCustomLabel ? title.labelRU : defaultLabelRU}
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
              onMouseOver={handleMouseOverEN}
              onMouseOut={handleMouseOutEN}
              onClick={() => handleClick(SYSTEM_LANGUAGES.en)}
              onBlur={handleBlurEN}
              role="button"
              tabIndex={0}
            >
              <TitleLabel>{title?.labelEN || defaultLabel}</TitleLabel>
              &nbsp;
              <i
                className="fa fa-pencil"
                style={{ color: isHoveredEN ? 'black' : 'grey' }}
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
              onMouseOver={handleMouseOverRU}
              onMouseOut={handleMouseOutRU}
              onClick={() => handleClick(SYSTEM_LANGUAGES.ru)}
              onBlur={handleBlurRU}
              role="button"
              tabIndex={0}
            >
              <TitleLabel>{title?.labelRU || defaultLabelRU}</TitleLabel>
              &nbsp;
              <i
                className="fa fa-pencil"
                style={{ color: isHoveredRU ? 'black' : 'grey' }}
              />
            </span>
          </Tooltip>
        </TitleWrapper>
      </TitlesWrapper>
    );
  };

export default AdhocMetricEditPopoverTitle;
