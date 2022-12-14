import React from 'react';
import ReactDOM from 'react-dom';
import { setConfig as setHotLoaderConfig } from 'react-hot-loader';
import singleSpaReact from 'single-spa-react';
import { GlobalError } from 'src/Superstructure/components/GlobalError'

import { RootComponent } from 'src/Superstructure/Root';

import './styles'; 

if (
  process.env.WEBPACK_MODE === 'development' ||
  process.env.WEBPACK_MODE === 'none'
) {
  setHotLoaderConfig({ logLevel: 'debug', trackTailUpdates: false });
}

export const { bootstrap, mount, unmount } = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: RootComponent,
  errorBoundary: err => (
    <GlobalError
      title='Error happened =('
      body={err.message}
      stackTrace={err.stack}
    />
  ),
});
