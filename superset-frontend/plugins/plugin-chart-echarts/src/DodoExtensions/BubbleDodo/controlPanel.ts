import { smartDateFormatter, t } from '@superset-ui/core';
import {
  ControlPanelConfig,
  D3_FORMAT_DOCS,
  D3_TIME_FORMAT_OPTIONS,
  formatSelectOptions,
} from '@superset-ui/chart-controls';

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
        name: 'x_force_timestamp_formatting',
        config: {
          type: 'CheckboxControl',
          label: t('Force date format'),
          renderTrigger: true,
          default: false,
          description: t(
            'Use date formatting even when metric value is not a timestamp',
          ),
        },
      },
    ],
    [
      {
        name: 'x_time_format',
        config: {
          type: 'SelectControl',
          freeForm: true,
          label: t('Date format'),
          renderTrigger: true,
          choices: D3_TIME_FORMAT_OPTIONS,
          description: D3_FORMAT_DOCS,
          default: smartDateFormatter.id,
        },
      },
    ],
    ['x_axis_format'],
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
        name: 'y_force_timestamp_formatting',
        config: {
          type: 'CheckboxControl',
          label: t('Force date format'),
          renderTrigger: true,
          default: false,
          description: t(
            'Use date formatting even when metric value is not a timestamp',
          ),
        },
      },
    ],
    [
      {
        name: 'y_time_format',
        config: {
          type: 'SelectControl',
          freeForm: true,
          label: t('Date format'),
          renderTrigger: true,
          choices: D3_TIME_FORMAT_OPTIONS,
          description: D3_FORMAT_DOCS,
          default: smartDateFormatter.id,
        },
      },
    ],
    ['y_axis_format'],
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

const labels = {
  label: t('Label Options'),
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
    [
      {
        name: 'label_location',
        config: {
          type: 'SelectControl',
          label: t('Label location'),
          renderTrigger: true,
          default: 'top',
          choices: formatSelectOptions<string>([
            'top',
            'left',
            'right',
            'bottom',
            'inside',
            'insideLeft',
            'insideRight',
            'insideTop',
            'insideBottom',
            'insideTopLeft',
            'insideBottomLeft',
            'insideTopRight',
            'insideBottomRight',
          ]),
        },
      },
    ],
    [
      {
        name: 'label_font_size',
        config: {
          type: 'TextControl',
          label: t('Label font (in pixels)'),
          renderTrigger: true,
          default: 12,
        },
      },
    ],
    [
      {
        name: 'label_color',
        config: {
          label: t('Label color'),
          type: 'ColorPickerControl',
          renderTrigger: true,
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
      ],
    },
    { ...labels },
    { ...dimentions },
    // @ts-ignore
    { ...xAxis },
    // @ts-ignore
    { ...yAxis },
    {
      label: t('Size'),
      expanded: false,
      controlSetRows: [['size_format']],
    },
  ],
};

export default config;
