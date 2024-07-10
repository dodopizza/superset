// DODO was here

import { t } from '@superset-ui/core';
import {
  ControlPanelConfig,
  formatSelectOptions,
  getStandardizedControls,
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

// const xAxisLabel: CustomControlItem = {
//   name: 'x_axis_label',
//   config: {
//     type: 'TextControl',
//     label: t('X Axis Label'),
//     renderTrigger: true,
//     default: '',
//   },
// };
//
// const leftMargin: CustomControlItem = {
//   name: 'left_margin',
//   config: {
//     type: 'SelectControl',
//     freeForm: true,
//     clearable: false,
//     label: t('Left Margin'),
//     choices: [
//       ['auto', t('auto')],
//       [50, '50'],
//       [75, '75'],
//       [100, '100'],
//       [125, '125'],
//       [150, '150'],
//       [200, '200'],
//     ],
//     default: 'auto',
//     renderTrigger: true,
//     description: t(
//       'Left margin, in pixels, allowing for more room for axis labels',
//     ),
//   },
// };
//
// const xAxisFormat: CustomControlItem = {
//   name: 'x_axis_format',
//   config: {
//     type: 'SelectControl',
//     freeForm: true,
//     label: t('X Axis Format'),
//     renderTrigger: true,
//     choices: D3_TIME_FORMAT_OPTIONS,
//     default: 'smart_date',
//     description: D3_FORMAT_DOCS,
//   },
// };
//
// const xTicksLayout: CustomControlItem = {
//   name: 'x_ticks_layout',
//   config: {
//     type: 'SelectControl',
//     label: t('X Tick Layout'),
//     choices: [
//       ['auto', t('auto')],
//       ['flat', t('flat')],
//       ['45°', '45°'],
//       ['staggered', t('staggered')],
//     ],
//     default: 'auto',
//     clearable: false,
//     renderTrigger: true,
//     description: t('The way the ticks are laid out on the X-axis'),
//   },
// };
//
// const xAxisShowMinmax: CustomControlItem = {
//   name: 'x_axis_showminmax',
//   config: {
//     type: 'CheckboxControl',
//     label: t('X bounds'),
//     renderTrigger: true,
//     default: false,
//     description: t('Whether to display the min and max values of the X-axis'),
//   },
// };
//
// const yAxisLabel: CustomControlItem = {
//   name: 'y_axis_label',
//   config: {
//     type: 'TextControl',
//     label: t('Y Axis Label'),
//     renderTrigger: true,
//     default: '',
//   },
// };
//
// const bottomMargin: CustomControlItem = {
//   name: 'bottom_margin',
//   config: {
//     type: 'SelectControl',
//     clearable: false,
//     freeForm: true,
//     label: t('Bottom Margin'),
//     choices: [
//       ['auto', t('auto')],
//       [50, '50'],
//       [75, '75'],
//       [100, '100'],
//       [125, '125'],
//       [150, '150'],
//       [200, '200'],
//     ],
//     default: 'auto',
//     renderTrigger: true,
//     description: t(
//       'Bottom margin, in pixels, allowing for more room for axis labels',
//     ),
//   },
// };
//
// const yLogScale: CustomControlItem = {
//   name: 'y_log_scale',
//   config: {
//     type: 'CheckboxControl',
//     label: t('Y Log Scale'),
//     default: false,
//     renderTrigger: true,
//     description: t('Use a log scale for the Y-axis'),
//   },
// };
//
// const yAxisShowMinmax: CustomControlItem = {
//   name: 'y_axis_showminmax',
//   config: {
//     type: 'CheckboxControl',
//     label: t('Y bounds'),
//     renderTrigger: true,
//     default: false,
//     description: t('Whether to display the min and max values of the Y-axis'),
//   },
// };
//
// const yAxisBounds: CustomControlItem = {
//   name: 'y_axis_bounds',
//   config: {
//     type: 'BoundsControl',
//     label: t('Y Axis Bounds'),
//     renderTrigger: true,
//     default: [null, null],
//     description: t(
//       'Bounds for the Y-axis. When left empty, the bounds are ' +
//         'dynamically defined based on the min/max of the data. Note that ' +
//         "this feature will only expand the axis range. It won't " +
//         "narrow the data's extent.",
//     ),
//   },
// };

const xAxis = {
  label: t('X Axis'),
  expanded: false,
  controlSetRows: [
    [
      {
        name: 'x_log_scale',
        config: {
          type: 'CheckboxControl',
          label: t('X Log Scale'),
          renderTrigger: true,
          default: false,
          description: t('Use a log scale for the X-axis.'),
        },
      },
    ],
    [
      {
        name: 'x_axis_name',
        config: {
          type: 'TextControl',
          label: t('X Axis name'),
          renderTrigger: true,
          default: 0,
          description: t('X axis name'),
        },
      },
    ],
    [
      {
        name: 'x_name_location',
        config: {
          type: 'SelectControl',
          label: t('Name location'),
          renderTrigger: true,
          default: 'center',
          choices: formatSelectOptions<string>(['start', 'center', 'end']),
        },
      },
      {
        name: 'x_name_gap_in_pixel',
        config: {
          type: 'TextControl',
          label: t('Name gap (in pixels)'),
          renderTrigger: true,
          default: 30,
          description: t('Name gap from chart grid'),
        },
      },
    ],
  ],
};

const yAxis = {
  label: t('Y Axis'),
  expanded: false,
  controlSetRows: [
    [
      {
        name: 'y_log_scale',
        config: {
          type: 'CheckboxControl',
          label: t('Y Log Scale'),
          renderTrigger: true,
          default: false,
          description: t('Use a log scale for the Y-axis.'),
        },
      },
    ],
    [
      {
        name: 'y_axis_name',
        config: {
          type: 'TextControl',
          label: t('Y Axis name'),
          renderTrigger: true,
          default: 0,
          description: t('Y axis name'),
        },
      },
    ],
    [
      {
        name: 'y_name_location',
        config: {
          type: 'SelectControl',
          label: t('Name location'),
          renderTrigger: true,
          default: 'center',
          choices: formatSelectOptions<string>(['start', 'center', 'end']),
        },
      },
      {
        name: 'y_name_gap_in_pixel',
        config: {
          type: 'TextControl',
          label: t('Name gap (in pixels)'),
          renderTrigger: true,
          default: 30,
          description: t('Name gap from chart grid'),
        },
      },
    ],
  ],
};

const dimentions = {
  label: t('Dimension Options'),
  expanded: false,
  controlSetRows: [
    [
      {
        name: 'show_dimension',
        config: {
          type: 'CheckboxControl',
          label: t('Show dimension'),
          renderTrigger: true,
          default: false,
          description: t('Whether to display the dimension.'),
        },
      },
    ],
    [
      {
        name: 'margin_top_in_pixel',
        config: {
          type: 'TextControl',
          label: t('Grid margin top (in pixels)'),
          renderTrigger: true,
          default: 0,
          description: t('Margin top for chart grid'),
        },
      },
    ],
    [
      {
        name: 'scroll_dimensions',
        config: {
          type: 'CheckboxControl',
          label: t('Scroll dimension'),
          renderTrigger: true,
          default: false,
          description: t('Whether to scroll dimensions.'),
        },
      },
    ],
  ],
};

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['series'],
        ['entity'],
        ['x'],
        ['y'],
        ['adhoc_filters'],
        ['size'],
        [
          {
            name: 'max_bubble_size',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Max Bubble Size'),
              default: '25',
              choices: formatSelectOptions([
                '5',
                '10',
                '15',
                '25',
                '50',
                '75',
                '100',
              ]),
            },
          },
        ],
        // ['limit', null],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'show_labels',
            config: {
              type: 'CheckboxControl',
              label: t('Show Labels'),
              renderTrigger: true,
              default: false,
              description: t('Whether to display the labels.'),
            },
          },
        ],
      ],
    },
    { ...dimentions },
    { ...xAxis },
    { ...yAxis },
    {
      label: t('Tooltip'),
      expanded: false,
      controlSetRows: [['x_axis_format'], ['y_axis_format'], ['size_format']],
    },
  ],

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
