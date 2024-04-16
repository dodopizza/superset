// DODO was here

import { t } from '@superset-ui/core';
import React from 'react';
import { StyledFlag } from '../../common';
import {
  controlPanelCommonConditionalFormattingMessageRow,
  controlPanelCommonConditionalFormattingRow,
} from '../controlPanelCommon';

const BigNumberControlPanelConditionalFormatting = {
  label: t('Conditional formatting'),
  expanded: false,
  controlSetRows: [
    [...controlPanelCommonConditionalFormattingRow],
    [...controlPanelCommonConditionalFormattingMessageRow],
  ],
};

// DODO added #32232659
const BigNumberControlPanelControlChartDescription = {
  label: t('Chart description'),
  expanded: false,
  controlSetRows: [
    [
      {
        name: 'chart_description_ru',
        config: {
          type: 'TextAreaControlNoModal',
          label: (
            <>
              <StyledFlag
                style={{ display: 'inline', marginRight: '0.5rem' }}
                language="ru"
                pressToTheBottom={false}
              />
              <span>{t('Chart description')}</span>
            </>
          ),
          renderTrigger: true,
          description: t(
            'Tooltip text that shows up below this chart on dashboard',
          ),
        },
      },
    ],
    [
      {
        name: 'chart_description_en',
        config: {
          type: 'TextAreaControlNoModal',
          label: (
            <>
              <StyledFlag
                style={{ display: 'inline', marginRight: '0.5rem' }}
                language="gb"
                pressToTheBottom={false}
              />
              <span>{t('Chart description')}</span>
            </>
          ),
          renderTrigger: true,
          description: t(
            'Tooltip text that shows up below this chart on dashboard',
          ),
        },
      },
    ],
  ],
};

export {
  BigNumberControlPanelConditionalFormatting,
  BigNumberControlPanelControlChartDescription,
};
