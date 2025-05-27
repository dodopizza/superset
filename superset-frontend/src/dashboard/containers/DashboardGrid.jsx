// DODO was here
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DashboardGrid from '../components/DashboardGrid';

import {
  handleComponentDrop,
  resizeComponent,
} from '../actions/dashboardLayout';
import {
  setDirectPathToChild,
  setEditMode,
  toggleIsExportingData, // DODO added 48951211
} from '../actions/dashboardState';

function mapStateToProps({ dashboardState, dashboardInfo }) {
  return {
    editMode: dashboardState.editMode,
    canEdit: dashboardInfo.dash_edit_perm,
    dashboardId: dashboardInfo.id,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      handleComponentDrop,
      resizeComponent,
      setDirectPathToChild,
      setEditMode,
      toggleIsExportingData, // DODO added 48951211
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardGrid);
