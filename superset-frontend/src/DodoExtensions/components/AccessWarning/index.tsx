import React from 'react';
import { t, styled } from '@superset-ui/core';
import CopyToClipboard from 'src/components/CopyToClipboard';
import Button from 'src/components/Button';
import { useHistory } from 'react-router-dom';
import { formAccessOptionLabel } from '../AccessConfigurationModal/utils';

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  height: 100%;
  font-size: ${({ theme }) => theme.typography.sizes.l}px;

  p {
    margin: 0;
    text-align: center;
  }

  span {
    font-weight: ${({ theme }) => theme.typography.weights.bold};
  }
`;

interface IProps {
  entity: 'dashboard' | 'chart';
  owners: {
    id: number;
    email?: string;
    first_name?: string;
    last_name?: string;
    teams?: Array<{ name: string }>;
    user_info?: Array<{ country_name: string | null }>;
  }[];
}

const AccessWarning = ({ entity, owners }: IProps) => {
  const {
    location: { pathname, search },
  } = useHistory();
  const { protocol, hostname, port } = window.location;

  const owner = owners?.[0];

  const url = `${protocol}//${hostname}${
    port ? `:${port}` : ''
  }${pathname}${search}`;

  const clipboardMessage = `${t(
    entity === 'dashboard'
      ? "I'm requesting access to this dashboard:"
      : "I'm requesting access to this chart:",
  )} ${url}`;

  return (
    <StyledWrapper>
      <p>
        {t(
          entity === 'dashboard'
            ? "You don't have access to this dashboard."
            : "You don't have access to this chart.",
        )}
      </p>
      {owner && (
        <>
          <p>
            {t('Contact the owner for access')}:{' '}
            <span>{formAccessOptionLabel(owners[0])}.</span>
          </p>
          <p>{t('You can copy a prepared message to send to the owner.')}</p>
          <CopyToClipboard
            copyNode={
              <Button buttonSize="small" buttonStyle="primary">
                {t('Copy to Clipboard')}
              </Button>
            }
            text={clipboardMessage}
            shouldShowText={false}
            hideTooltip
          />
        </>
      )}
      {!owner && (
        <p>
          {t("The %(entity)s doesn't have an owner.", { entity: t(entity) })}
        </p>
      )}
    </StyledWrapper>
  );
};

export default AccessWarning;
