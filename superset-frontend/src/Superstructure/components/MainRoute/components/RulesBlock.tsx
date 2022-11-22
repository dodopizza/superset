import React from 'react';

import { RULES_TITLE, RULES_DESSCRIPTION, RULES_ATTENTION } from '../constants';

import { StyledH4, StyledP } from '../styles';

const RulesBlock = () => (
  <div>
    <StyledH4>{RULES_TITLE}</StyledH4>
    <StyledP>{RULES_DESSCRIPTION}</StyledP>
    <StyledP>
      <i>{RULES_ATTENTION}</i>
    </StyledP>
  </div>
);

export { RulesBlock };
