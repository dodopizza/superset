// DODO was here
import React, { useEffect, useState } from 'react';
import Gravatar from 'react-gravatar';
import moment from 'moment';
import { styled, SupersetClient, t } from '@superset-ui/core';
import { BootstrapUser } from 'src/types/bootstrapTypes';
import { REQUEST_PAGE_URL } from '../../DodoExtensions/onBoarding/consts';

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
  // DODO added start 32839667
  const [requestListLoading, setRequestListLoading] = useState(false);
  const [requestList, setRequestList] = useState<
    Array<{ id: number; finished: boolean }>
  >([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [team, setTeam] = useState<string>('');

  useEffect(() => {
    try {
      setRequestListLoading(true);

      SupersetClient.get({
        url: '/api/v1/me/statements',
        headers: { 'Content-Type': 'application/json' },
        parseMethod: null,
      })
        .then(response => response.json())
        .then(dto => {
          setRequestList(dto.result.statements);
        });
    } finally {
      setRequestListLoading(false);
    }
  }, []);

  useEffect(() => {
    try {
      setTeamLoading(true);

      SupersetClient.get({
        url: '/api/v1/me/team',
        headers: { 'Content-Type': 'application/json' },
        parseMethod: null,
      })
        .then(response => response.json())
        .then(dto => {
          setTeam(dto.result.team);
        });
    } finally {
      setTeamLoading(false);
    }
  }, []);
  // DODO added stop 32839667

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
          {requestListLoading ? (
            <span>Loading...</span>
          ) : (
            requestList.map(item => {
              const className = item.finished
                ? 'fa fa-check'
                : 'fa fa-hourglass-half';
              return (
                <li key={item.id}>
                  <i className={className} aria-hidden="true" />
                  &nbsp;&nbsp;&nbsp;
                  <span>
                    <a href={REQUEST_PAGE_URL.replace(':id', `${item.id}`)}>
                      {item.id}
                    </a>
                  </span>
                </li>
              );
            })
          )}
        </List>
        <hr />
        <h4 className="username">{t('Team')}</h4>
        {teamLoading ? <span>Loading...</span> : <span>{team}</span>}
        {/* DODO added stop 32839667 */}
      </div>
    </StyledContainer>
  );
}
