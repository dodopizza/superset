// DODO was here
import PropTypes from 'prop-types';
import componentTypes from './componentTypes';
import backgroundStyleOptions from './backgroundStyleOptions';
import headerStyleOptions from './headerStyleOptions';

export const componentShape = PropTypes.shape({
  id: PropTypes.string.isRequired,
  type: PropTypes.oneOf(Object.values(componentTypes)).isRequired,
  parents: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.arrayOf(PropTypes.string),
  meta: PropTypes.shape({
    // Dimensions
    width: PropTypes.number,
    height: PropTypes.number,

    // Header
    headerSize: PropTypes.oneOf(headerStyleOptions.map(opt => opt.value)),

    // Row
    background: PropTypes.oneOf(backgroundStyleOptions.map(opt => opt.value)),

    // Chart
    chartId: PropTypes.number,
  }),
});

export const chartPropShape = PropTypes.shape({
  id: PropTypes.number.isRequired,
  chartAlert: PropTypes.string,
  chartStatus: PropTypes.string,
  chartUpdateEndTime: PropTypes.number,
  chartUpdateStartTime: PropTypes.number,
  latestQueryFormData: PropTypes.object,
  queryController: PropTypes.shape({ abort: PropTypes.func }),
  queriesResponse: PropTypes.arrayOf(PropTypes.object),
  triggerQuery: PropTypes.bool,
  lastRendered: PropTypes.number,
  extraFormData: PropTypes.object, // DODO added 36195582
});

export const slicePropShape = PropTypes.shape({
  slice_id: PropTypes.number.isRequired,
  slice_url: PropTypes.string.isRequired,
  slice_name: PropTypes.string.isRequired,
  datasource: PropTypes.string,
  datasource_name: PropTypes.string,
  datasource_link: PropTypes.string,
  changed_on: PropTypes.number.isRequired,
  modified: PropTypes.string,
  viz_type: PropTypes.string.isRequired,
  description: PropTypes.string,
  description_markeddown: PropTypes.string,
  owners: PropTypes.arrayOf(PropTypes.string),
});

export const dashboardFilterPropShape = PropTypes.shape({
  chartId: PropTypes.number.isRequired,
  componentId: PropTypes.string.isRequired,
  filterName: PropTypes.string.isRequired,
  datasourceId: PropTypes.string.isRequired,
  directPathToFilter: PropTypes.arrayOf(PropTypes.string).isRequired,
  isDateFilter: PropTypes.bool.isRequired,
  isInstantFilter: PropTypes.bool.isRequired,
  columns: PropTypes.object,
  labels: PropTypes.object,
  scopes: PropTypes.object,
});

export const dashboardStatePropShape = PropTypes.shape({
  sliceIds: PropTypes.arrayOf(PropTypes.number),
  expandedSlices: PropTypes.object,
  editMode: PropTypes.bool,
  isPublished: PropTypes.bool,
  colorNamespace: PropTypes.string,
  colorScheme: PropTypes.string,
  updatedColorScheme: PropTypes.bool,
  hasUnsavedChanges: PropTypes.bool,
});

export const dashboardInfoPropShape = PropTypes.shape({
  id: PropTypes.number,
  metadata: PropTypes.object,
  slug: PropTypes.string,
  dash_edit_perm: PropTypes.bool,
  dash_save_perm: PropTypes.bool,
  common: PropTypes.object,
  userId: PropTypes.string,
});

/* eslint-disable-next-line  no-undef */
const lazyFunction = f => () => f().apply(this, arguments);

const leafType = PropTypes.shape({
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
});

const parentShape = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  label: PropTypes.string.isRequired,
  children: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.shape(lazyFunction(() => parentShape)),
      leafType,
    ]),
  ),
};

export const filterScopeSelectorTreeNodePropShape = PropTypes.oneOfType([
  PropTypes.shape(parentShape),
  leafType,
]);
