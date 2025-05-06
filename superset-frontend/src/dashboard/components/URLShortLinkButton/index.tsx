// DODO was here
import { useState } from 'react';
import { getClientErrorObject, t } from '@superset-ui/core';
import Popover, { PopoverProps } from 'src/components/Popover';
import CopyToClipboard from 'src/components/CopyToClipboard';
import { getDashboardPermalink } from 'src/utils/urlUtils';
import { useToasts } from 'src/components/MessageToasts/withToasts';
import { useSelector } from 'react-redux';
import { RootState } from 'src/dashboard/types';

export type URLShortLinkButtonProps = {
  dashboardId: number;
  anchorLinkId?: string;
  emailSubject?: string;
  emailContent?: string;
  placement?: PopoverProps['placement'];
};

export default function URLShortLinkButton({
  dashboardId,
  anchorLinkId,
  placement = 'right', // DODO deleted emailSubject and emailContent props
}: URLShortLinkButtonProps) {
  const [shortUrl, setShortUrl] = useState('');
  const { addDangerToast } = useToasts();
  const { dataMask, activeTabs } = useSelector((state: RootState) => ({
    dataMask: state.dataMask,
    activeTabs: state.dashboardState.activeTabs,
  }));

  const getCopyUrl = async () => {
    try {
      const url = await getDashboardPermalink({
        dashboardId,
        dataMask,
        activeTabs,
        anchor: anchorLinkId,
      });
      setShortUrl(url);
    } catch (error) {
      if (error) {
        addDangerToast(
          (await getClientErrorObject(error)).error ||
            t('Something went wrong.'),
        );
      }
    }
  };

  // DODO commented out
  // const emailBody = `${emailContent}${shortUrl || ''}`;
  // const emailLink = `mailto:?Subject=${emailSubject}%20&Body=${emailBody}`;

  return (
    <Popover
      trigger="click"
      placement={placement}
      content={
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <div
          id="shorturl-popover"
          data-test="shorturl-popover"
          onClick={e => {
            e.stopPropagation();
          }}
        >
          <CopyToClipboard
            text={shortUrl}
            copyNode={
              <i className="fa fa-clipboard" title={t('Copy to clipboard')} />
            }
          />
          {/* DODO commented out */}
          {/* &nbsp;&nbsp;
          <a href={emailLink}>
            <i className="fa fa-envelope" />
          </a> */}
        </div>
      }
    >
      <span
        className="short-link-trigger btn btn-default btn-sm"
        tabIndex={-1}
        role="button"
        onClick={e => {
          e.stopPropagation();
          getCopyUrl();
        }}
      >
        <i className="short-link-trigger fa fa-link" />
        &nbsp;
      </span>
    </Popover>
  );
}
