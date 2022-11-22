import React from 'react';
import ReactDOM from 'react-dom';
import { setConfig as setHotLoaderConfig } from 'react-hot-loader';
import singleSpaReact from 'single-spa-react';

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
    <div style={{ padding: '2em' }}>
      <h1>Error happened =(</h1>
      <span>Error message:</span>
      <h2>{err.message}</h2>
      <span>
        Stack trace: <br />{' '}
      </span>
      <code>{err.stack}</code>
    </div>
  ),
});
