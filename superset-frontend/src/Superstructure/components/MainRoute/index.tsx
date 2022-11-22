import { hot } from 'react-hot-loader/root';
import React from 'react';

import { AnalyticsMainWrapper, StyledH1, Alert } from './styles';

import { MAIN_TITLE } from './constants';

import {
  InfoIcon,
  RowWrapper,
  ColumnWrapper,
  RulesBlock,
  ButtonsBlock,
} from './components';

const AnalyticsMain = () => {
  // In dodois the div.all has css property min-height, that forces the footer to be overlapped
  const dodoElementAll = document.getElementsByClassName('all')[0];

  if (dodoElementAll && dodoElementAll.classList.contains('overwrite-height')) {
    dodoElementAll.classList.remove('overwrite-height');
  }

  return (
    <AnalyticsMainWrapper>
      <RowWrapper>
        <StyledH1>{MAIN_TITLE}</StyledH1>
      </RowWrapper>
      <RowWrapper>
        <ColumnWrapper classes="col-sm-12 col-md-6">
          <Alert>
            <RowWrapper>
              <ColumnWrapper classes="col-md-1 tinycolumn">
                <InfoIcon />
              </ColumnWrapper>
              <ColumnWrapper classes="col-md-11">
                <RulesBlock />
              </ColumnWrapper>
            </RowWrapper>
          </Alert>
        </ColumnWrapper>
      </RowWrapper>
      <RowWrapper>
        <ColumnWrapper classes="col-sm-12 col-md-6">
          <ButtonsBlock />
        </ColumnWrapper>
      </RowWrapper>
    </AnalyticsMainWrapper>
  );
};

export default hot(AnalyticsMain);
