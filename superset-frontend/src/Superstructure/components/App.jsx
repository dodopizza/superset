import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@superset-ui/core';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { DynamicPluginProvider } from 'src/components/DynamicPlugins';
import setupApp from 'src/setup/setupApp';
import DashboardPage from 'src/Superstructure/components/DashboardPage';
import { ROLLBAR_CONFIG } from 'src/firebase/rollbar';
import { theme } from '../../preamble';

setupApp();

const App = ({ store, dashboardIdOrSlug }) => (
  <RollbarProvider config={ROLLBAR_CONFIG}>
    <ErrorBoundary>
      <Provider store={store}>
        <DndProvider backend={HTML5Backend} context={window}>
          <ThemeProvider theme={theme}>
            <DynamicPluginProvider>
              <DashboardPage store={store} idOrSlug={dashboardIdOrSlug} />
            </DynamicPluginProvider>
          </ThemeProvider>
        </DndProvider>
      </Provider>
    </ErrorBoundary>
  </RollbarProvider>
);

export default hot(App);
