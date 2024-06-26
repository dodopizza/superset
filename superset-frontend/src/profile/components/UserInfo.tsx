// DODO was here
import React from 'react';
import Gravatar from 'react-gravatar';
import moment from 'moment';
import { styled, t } from '@superset-ui/core';
import { BootstrapUser } from 'src/types/bootstrapTypes';

interface UserInfoProps {
  user: BootstrapUser;
}

const StyledContainer = styled.div`
  .panel {
    padding: ${({ theme }) => theme.gridUnit * 6}px;
  }

  /* DODO added start 32839667 */

  .username {
    overflow-wrap: break-word;
    font-size: 1rem;
  }

  /* DODO added stop 32839667 */
`;

// DODO added start 32839667
const List = styled.ul`
  padding-left: 0;
  list-style-type: none;
`;
// DODO added stop 32839667

export default function UserInfo({ user }: UserInfoProps) {
  return (
    <StyledContainer>
      <a href="https://en.gravatar.com/">
        <Gravatar
          email={user?.email}
          width="100%"
          height=""
          size={220}
          alt={t('Profile picture provided by Gravatar')}
          className="img-rounded"
          style={{ borderRadius: 15 }}
        />
      </a>
      <hr />
      <div className="panel">
        <div className="header">
          <h3>
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
          </h3>
          <h4 className="username">
            <i className="fa fa-user-o" /> {user?.username}
          </h4>
        </div>
        <hr />
        <p>
          <i className="fa fa-clock-o" data-test="clock-icon-test" />{' '}
          {t('joined')} {moment(user?.createdOn, 'YYYYMMDD').fromNow()}
        </p>
        <p className="email">
          <i className="fa fa-envelope-o" /> {user?.email}
        </p>
        <p className="roles">
          <i className="fa fa-lock" />{' '}
          {Object.keys(user?.roles || {}).join(', ')}
        </p>
        <p>
          <i className="fa fa-key" />
          &nbsp;
          <span className="text-muted">{t('id')}:</span>&nbsp;
          <span className="user-id">{user?.userId}</span>
        </p>
        {/* DODO added start 32839667 */}
        <hr />
        <h4 className="username">{t('Requests')}</h4>
        <List>
          <li>
            <i className="fa fa-check" aria-hidden="true" />
            &nbsp;<span>9876534</span>
          </li>
          <li>
            <i className="fa fa-hourglass-half" aria-hidden="true" />
            &nbsp;<span>012345</span>
          </li>
        </List>
        {/* DODO added start 32839667 */}
      </div>
    </StyledContainer>
  );
}
