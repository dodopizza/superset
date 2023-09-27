// DODO was here
// dashboardLanguage

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DashboardGrid from '../components/DashboardGrid';

import {
  handleComponentDrop,
  resizeComponent,
} from '../actions/dashboardLayout';
import { setDirectPathToChild, setEditMode } from '../actions/dashboardState';

function mapStateToProps({ dashboardState, dashboardInfo }) {
  console.log('RT DODO: переводы dashboardInfoXXX', dashboardInfo);
  return {
    editMode: dashboardState.editMode,
    canEdit: dashboardInfo.dash_edit_perm,
    dashboardId: dashboardInfo.id,
    dashboardLanguage: dashboardInfo.selected_lang,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      handleComponentDrop,
      resizeComponent,
      setDirectPathToChild,
      setEditMode,
    },
    dispatch,
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardGrid);
