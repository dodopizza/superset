import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { ErrorBanner, Loading, Version } from 'src/Superstructure/components';
import { MicrofrontendParams } from 'src/Superstructure/types/global';
import { composeAPIConfig } from 'src/Superstructure/config';

import { theme } from 'src/Superstructure/theme';
import { store } from 'src/Superstructure/store';

import LeftNavigation from 'src/Superstructure/components/LeftNavigation/index';
import Main from 'src/Superstructure/components/Main/index';

import setupClient from 'src/Superstructure/setupClient';
import { initializeAuth } from 'src/Superstructure/Root/initUtils';

import {
  getFullConfig,
  getNavigationConfig,
  APP_VERSION,
} from '../parseEnvFile/index';
import { RootComponentWrapper, DashboardComponentWrapper } from './styles';

const NAV_CONFIG = getNavigationConfig();

const CONFIG = getFullConfig(
  process.env.WEBPACK_MODE as 'development' | 'production' | 'none',
  NAV_CONFIG,
);

setupClient();

const addSlash = (baseName?: string) => {
  if (!baseName) return '/';
  if (baseName[baseName.length - 1] === '/') return baseName;
  return `${baseName}/`;
};

export const RootComponent = (incomingParams: MicrofrontendParams) => {
  const params = useMemo(() => {
    const parameters = { ...incomingParams, ...CONFIG };
    const basename = addSlash(parameters.basename);

    return {
      ...parameters,
      basename,
    };
  }, [incomingParams]);

  console.groupCollapsed('CONFIGS:');
  console.log('\n');
  console.log('Initial =>', CONFIG);
  console.log('Incoming =>', incomingParams);
  console.log('\n');
  console.log('Used Config:');
  console.log(params);
  console.groupEnd();

  const [isLoaded, setLoaded] = useState(false);
  const [isError, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    composeAPIConfig(params);
  }, [params]);

  useEffect(() => {
    const performInitilizeAuth = async () => {
      const { loaded, error, errorMsg } = await initializeAuth(params);
      if (loaded) setLoaded(true);

      if (error) {
        setLoaded(false);
        setError(true);
        setErrorMessage(errorMsg);
      }
    };

    performInitilizeAuth();
  }, [params]);

  const { navigation, basename } = params;

  const useNavigationMenu = navigation?.showNavigationMenu;

  console.log('paramsXX', params);

  return (
    <>
      {isError ? (
        <ErrorBanner
          title="Error happened =("
          body={errorMessage}
          stackTrace="INIT_API => failed"
        />
      ) : !isLoaded ? (
        <Loading />
      ) : isLoaded && navigation && basename ? (
        <RootComponentWrapper withNavigation={useNavigationMenu}>
          {useNavigationMenu && navigation && navigation.main ? (
            <Router>
              <LeftNavigation
                routesConfig={navigation.routes}
                baseRoute={basename}
              />
              <DashboardComponentWrapper withNavigation={useNavigationMenu}>
                <Version appVersion={APP_VERSION} />
                <Main
                  navigation={navigation}
                  store={store}
                  theme={theme}
                  basename={basename}
                />
              </DashboardComponentWrapper>
            </Router>
          ) : (
            <ErrorBanner
              title="Error happened =("
              body="There is no dashboard ID or slug provided."
              stackTrace="Either provide dashboard ID or slug or enable navigation via useNavigationMenu flag"
            />
          )}
        </RootComponentWrapper>
      ) : (
        isLoaded &&
        (!navigation || !basename) && (
          <ErrorBanner
            title="Error happened =("
            body="There is no navigation object or basename provided"
            stackTrace="Provide navigation object and|or basename"
          />
        )
      )}
    </>
  );
};
