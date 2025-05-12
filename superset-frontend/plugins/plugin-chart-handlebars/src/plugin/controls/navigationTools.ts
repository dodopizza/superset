// DODO created 49751291
import { ControlSetItem } from '@superset-ui/chart-controls';
import { t } from '@superset-ui/core';

export const allowNavigationToolsControlSetItem: ControlSetItem = {
  name: 'allow_navigation_tools',
  config: {
    type: 'CheckboxControl',
    label: t('Allow navigation tools'),
    description: t(
      'Enable navigation tools for the handlebars template. Allows panning with middle mouse button or Cmd/Ctrl+drag, and zooming with Cmd/Ctrl+mouse wheel.',
    ),
    default: false,
    renderTrigger: true,
  },
};
