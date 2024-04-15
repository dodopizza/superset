// DODO added #32232659
import { CustomControlItem } from '@superset-ui/chart-controls';
import { t } from '@superset-ui/core';

export const conditionalMessageFontSize: CustomControlItem = {
  name: 'conditional_message_font_size',
  config: {
    type: 'SelectControl',
    label: t('Conditional message Font Size'),
    renderTrigger: true,
    clearable: false,
    default: 0.125,
    // Values represent the percentage of space a subheader should take
    options: [
      {
        label: t('Tiny'),
        value: 0.125,
      },
      {
        label: t('Small'),
        value: 0.15,
      },
      {
        label: t('Normal'),
        value: 0.2,
      },
      {
        label: t('Large'),
        value: 0.3,
      },
      {
        label: t('Huge'),
        value: 0.4,
      },
    ],
  },
};
