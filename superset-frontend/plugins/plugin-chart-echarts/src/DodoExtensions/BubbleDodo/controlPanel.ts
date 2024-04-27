// DODO was here

import { t } from '@superset-ui/core';
import {
  ControlPanelConfig,
  CustomControlItem,
  sections,
} from '@superset-ui/chart-controls';

const showLegend: CustomControlItem = {
  name: 'show_legend',
  config: {
    type: 'CheckboxControl',
    label: t('Legend'),
    renderTrigger: true,
    default: true,
    description: t('Whether to display the legend (toggles)'),
  },
};

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    // {
    //   label: t('Query'),
    //   expanded: true,
    //   controlSetRows: [
    //     ['series'],
    //     ['entity'],
    //     ['x'],
    //     ['y'],
    //     ['adhoc_filters'],
    //     ['size'],
    //     [
    //       {
    //         name: 'max_bubble_size',
    //         config: {
    //           type: 'SelectControl',
    //           freeForm: true,
    //           label: t('Max Bubble Size'),
    //           default: '25',
    //           choices: formatSelectOptions([
    //             '5',
    //             '10',
    //             '15',
    //             '25',
    //             '50',
    //             '75',
    //             '100',
    //           ]),
    //         },
    //       },
    //     ],
    //     ['limit', null],
    //   ],
    // },
    {
      label: t('Chart Options'),
      expanded: true,
      tabOverride: 'customize',
      controlSetRows: [['color_scheme'], [showLegend, null]],
    },
    // {
    //   label: t('X Axis'),
    //   expanded: true,
    //   tabOverride: 'customize',
    //   controlSetRows: [
    //     [xAxisLabel, leftMargin],
    //     [
    //       {
    //         name: xAxisFormat.name,
    //         config: {
    //           ...xAxisFormat.config,
    //           default: 'SMART_NUMBER',
    //           choices: D3_FORMAT_OPTIONS,
    //         },
    //       },
    //       xTicksLayout,
    //     ],
    //     [
    //       {
    //         name: 'x_log_scale',
    //         config: {
    //           type: 'CheckboxControl',
    //           label: t('X Log Scale'),
    //           default: false,
    //           renderTrigger: true,
    //           description: t('Use a log scale for the X-axis'),
    //         },
    //       },
    //       xAxisShowMinmax,
    //     ],
    //   ],
    // },
    // {
    //   label: t('Y Axis'),
    //   expanded: true,
    //   tabOverride: 'customize',
    //   controlSetRows: [
    //     [yAxisLabel, bottomMargin],
    //     ['y_axis_format', null],
    //     [yLogScale, yAxisShowMinmax],
    //     [yAxisBounds],
    //   ],
    // },
  ],
  controlOverrides: {
    color_scheme: {
      renderTrigger: false,
    },
  },
  // formDataOverrides: formData => ({
  //   ...formData,
  //   series: getStandardizedControls().shiftColumn(),
  //   entity: getStandardizedControls().shiftColumn(),
  //   x: getStandardizedControls().shiftMetric(),
  //   y: getStandardizedControls().shiftMetric(),
  //   size: getStandardizedControls().shiftMetric(),
  // }),
};

export default config;
