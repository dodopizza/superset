// DODO was here

import { t } from '@superset-ui/core';
import {
  ControlPanelConfig,
  CustomControlItem,
  D3_FORMAT_DOCS,
  D3_FORMAT_OPTIONS,
  D3_TIME_FORMAT_OPTIONS,
  getStandardizedControls,
  sections,
} from '@superset-ui/chart-controls';

// const showLegend: CustomControlItem = {
//   name: 'show_legend',
//   config: {
//     type: 'CheckboxControl',
//     label: t('Legend'),
//     renderTrigger: true,
//     default: true,
//     description: t('Whether to display the legend (toggles)'),
//   },
// };

export const xAxisLabel: CustomControlItem = {
  name: 'x_axis_label',
  config: {
    type: 'TextControl',
    label: t('X Axis Label'),
    renderTrigger: true,
    default: '',
  },
};

export const leftMargin: CustomControlItem = {
  name: 'left_margin',
  config: {
    type: 'SelectControl',
    freeForm: true,
    clearable: false,
    label: t('Left Margin'),
    choices: [
      ['auto', t('auto')],
      [50, '50'],
      [75, '75'],
      [100, '100'],
      [125, '125'],
      [150, '150'],
      [200, '200'],
    ],
    default: 'auto',
    renderTrigger: true,
    description: t(
      'Left margin, in pixels, allowing for more room for axis labels',
    ),
  },
};

export const xAxisFormat: CustomControlItem = {
  name: 'x_axis_format',
  config: {
    type: 'SelectControl',
    freeForm: true,
    label: t('X Axis Format'),
    renderTrigger: true,
    choices: D3_TIME_FORMAT_OPTIONS,
    default: 'smart_date',
    description: D3_FORMAT_DOCS,
  },
};

export const xTicksLayout: CustomControlItem = {
  name: 'x_ticks_layout',
  config: {
    type: 'SelectControl',
    label: t('X Tick Layout'),
    choices: [
      ['auto', t('auto')],
      ['flat', t('flat')],
      ['45°', '45°'],
      ['staggered', t('staggered')],
    ],
    default: 'auto',
    clearable: false,
    renderTrigger: true,
    description: t('The way the ticks are laid out on the X-axis'),
  },
};

export const xAxisShowMinmax: CustomControlItem = {
  name: 'x_axis_showminmax',
  config: {
    type: 'CheckboxControl',
    label: t('X bounds'),
    renderTrigger: true,
    default: false,
    description: t('Whether to display the min and max values of the X-axis'),
  },
};

export const yAxisLabel: CustomControlItem = {
  name: 'y_axis_label',
  config: {
    type: 'TextControl',
    label: t('Y Axis Label'),
    renderTrigger: true,
    default: '',
  },
};

export const bottomMargin: CustomControlItem = {
  name: 'bottom_margin',
  config: {
    type: 'SelectControl',
    clearable: false,
    freeForm: true,
    label: t('Bottom Margin'),
    choices: [
      ['auto', t('auto')],
      [50, '50'],
      [75, '75'],
      [100, '100'],
      [125, '125'],
      [150, '150'],
      [200, '200'],
    ],
    default: 'auto',
    renderTrigger: true,
    description: t(
      'Bottom margin, in pixels, allowing for more room for axis labels',
    ),
  },
};

export const yLogScale: CustomControlItem = {
  name: 'y_log_scale',
  config: {
    type: 'CheckboxControl',
    label: t('Y Log Scale'),
    default: false,
    renderTrigger: true,
    description: t('Use a log scale for the Y-axis'),
  },
};

export const yAxisShowMinmax: CustomControlItem = {
  name: 'y_axis_showminmax',
  config: {
    type: 'CheckboxControl',
    label: t('Y bounds'),
    renderTrigger: true,
    default: false,
    description: t('Whether to display the min and max values of the Y-axis'),
  },
};

export const yAxisBounds: CustomControlItem = {
  name: 'y_axis_bounds',
  config: {
    type: 'BoundsControl',
    label: t('Y Axis Bounds'),
    renderTrigger: true,
    default: [null, null],
    description: t(
      'Bounds for the Y-axis. When left empty, the bounds are ' +
        'dynamically defined based on the min/max of the data. Note that ' +
        "this feature will only expand the axis range. It won't " +
        "narrow the data's extent.",
    ),
  },
};

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['series'],
        // ['entity'],
        ['x'],
        ['y'],
        ['adhoc_filters'],
        // ['size'],
        // [
        //   {
        //     name: 'max_bubble_size',
        //     config: {
        //       type: 'SelectControl',
        //       freeForm: true,
        //       label: t('Max Bubble Size'),
        //       default: '25',
        //       choices: formatSelectOptions([
        //         '5',
        //         '10',
        //         '15',
        //         '25',
        //         '50',
        //         '75',
        //         '100',
        //       ]),
        //     },
        //   },
        // ],
        // ['limit', null],
      ],
    },
    // {
    //   label: t('Chart Options'),
    //   expanded: true,
    //   tabOverride: 'customize',
    //   controlSetRows: [['color_scheme'], [showLegend, null]],
    // },
    {
      label: t('X Axis'),
      expanded: true,
      tabOverride: 'customize',
      controlSetRows: [
        [xAxisLabel, leftMargin],
        [
          {
            name: xAxisFormat.name,
            config: {
              ...xAxisFormat.config,
              default: 'SMART_NUMBER',
              choices: D3_FORMAT_OPTIONS,
            },
          },
          xTicksLayout,
        ],
        [
          {
            name: 'x_log_scale',
            config: {
              type: 'CheckboxControl',
              label: t('X Log Scale'),
              default: false,
              renderTrigger: true,
              description: t('Use a log scale for the X-axis'),
            },
          },
          xAxisShowMinmax,
        ],
      ],
    },
    {
      label: t('Y Axis'),
      expanded: true,
      tabOverride: 'customize',
      controlSetRows: [
        [yAxisLabel, bottomMargin],
        ['y_axis_format', null],
        [yLogScale, yAxisShowMinmax],
        [yAxisBounds],
      ],
    },
  ],
  controlOverrides: {
    color_scheme: {
      renderTrigger: false,
    },
  },
  formDataOverrides: formData => ({
    ...formData,
    series: getStandardizedControls().shiftColumn(),
    entity: getStandardizedControls().shiftColumn(),
    x: getStandardizedControls().shiftMetric(),
    y: getStandardizedControls().shiftMetric(),
    size: getStandardizedControls().shiftMetric(),
  }),
};

export default config;
