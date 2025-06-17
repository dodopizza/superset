import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Rate } from 'antd';
import { addAlpha, styled, t, SupersetClient } from '@superset-ui/core';
import Button from 'src/components/Button';
import { TextArea } from 'src/components/Input';
import Checkbox from 'src/components/Checkbox';
import Icons from 'src/components/Icons';
import { Tooltip } from 'src/components/Tooltip';
import { useToasts } from 'src/components/MessageToasts/withToasts';
import { RootState } from '../../../../dashboard/types';

const CSI_LOCALSTORAGE_KEY = 'csi_form_closed_date';

const isStandalone = process.env.type === undefined;

const Container = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
`;

const InnerContainer = styled.div<{ isFolded: boolean }>`
  padding: 20px;
  width: 400px;
  background-color: ${({ theme }) => theme.colors.grayscale.light5};
  box-shadow: 0 2px 8px
    ${({ theme }) => addAlpha(theme.colors.grayscale.dark2, 0.2)};
  border: 1px solid ${({ theme }) => theme.colors.grayscale.light2};
  border-radius: 8px;
  min-width: 360px;
  opacity: ${({ isFolded }) => (isFolded ? 0 : 1)};
  transition: opacity 1s ease;
  ${({ isFolded }) => isFolded && 'pointer-events: none;'}
`;

const FoldButton = styled.span<{ isFolded: boolean }>`
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: 1;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.grayscale.base};
  rotate: 45deg;
  opacity: ${({ isFolded }) => (isFolded ? 0 : 1)};
  transition: all 1s ease;

  svg {
    font-size: 16px;
  }
`;

const UnfoldButton = styled.span<{ isFolded: boolean }>`
  position: absolute;
  bottom: 2px;
  right: 2px;
  z-index: 1;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.grayscale.light5};
  box-shadow: 0 2px 8px
    ${({ theme }) => addAlpha(theme.colors.grayscale.dark2, 0.2)};
  color: ${({ theme }) => theme.colors.grayscale.base};
  rotate: -135deg;
  opacity: ${({ isFolded }) => (isFolded ? 1 : 0)};
  transition: opacity 1s ease;
  cursor: pointer;
  pointer-events: ${({ isFolded }) => (isFolded ? 'auto' : 'none')};

  svg {
    font-size: 21px;
  }
`;

const Title = styled.p`
  margin-bottom: 16px;
`;

const FlexRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`;

const RatingWrapper = styled(FlexRow)`
  margin-bottom: 16px;
`;

const StyledRate = styled(Rate)`
  font-size: 30px;
  color: ${({ theme }) => theme.colors.primary.base};
`;

const StyledTextArea = styled(TextArea)`
  margin-bottom: 16px;
  max-height: 30vh;
  resize: block;
`;

const StyledButton = styled(Button)`
  width: 100%;
`;

const ThankYouMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.success.base};
`;

interface IProps {
  dashboardId: number | undefined;
}

interface FeedbackFormContentProps {
  dashboardId: number | undefined;
  currentStorage: Record<number, string>;
  data: {
    message: string;
  };
}

const FeedbackFormContent = ({
  dashboardId,
  currentStorage,
  data,
}: FeedbackFormContentProps) => {
  const [show, setShow] = useState(false);
  const [isFolded, setIsFolded] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { addDangerToast } = useToasts();

  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 2000);
  }, []);

  if (!show) return null;

  const toggleFolding = () => setIsFolded(prev => !prev);

  const handleClose = () => {
    const newStorage = {
      ...currentStorage,
      [dashboardId!]: new Date().toISOString(),
    };
    localStorage.setItem(CSI_LOCALSTORAGE_KEY, JSON.stringify(newStorage));
    setShow(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // await SupersetClient.post({
      //   endpoint: '/api/v1/csi-feedback/',
      //   jsonPayload: {
      //     type: 'csi-feedback',
      //     dashboard_id: dashboardId,
      //     rating,
      //     comment: comment.trim() || null,
      //     is_anonymous: isAnonymous,
      //     is_plugin: !isStandalone
      //   },
      // });

      await new Promise(resolve => {
        setTimeout(resolve, 2000);
      });

      setIsSubmitted(true);

      // Hide after 1 second
      setTimeout(() => {
        setShow(false);
      }, 1000);
    } catch (error) {
      addDangerToast(
        t(
          'An error occurred while submitting your feedback. Please try again.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      {!isSubmitted && (
        <FoldButton
          role="button"
          onClick={toggleFolding}
          tabIndex={0}
          isFolded={isFolded}
          aria-label={t('To fold')}
          title={t('To fold')}
        >
          <Icons.ArrowRightOutlined />
        </FoldButton>
      )}

      <InnerContainer isFolded={isFolded}>
        <Title>{data.message}</Title>

        <RatingWrapper>
          <StyledRate
            value={rating}
            onChange={setRating}
            allowHalf
            disabled={isLoading || isSubmitted}
          />
          <Tooltip
            title={
              isAnonymous
                ? t('Your feedback will be saved anonymously ')
                : t('Your feedback will not be saved anonymously')
            }
            placement="topRight"
          >
            <div>
              {t('Anonymously')}{' '}
              <Checkbox
                checked={isAnonymous}
                onChange={val => setIsAnonymous(Boolean(val))}
                disabled
              />
            </div>
          </Tooltip>
        </RatingWrapper>

        <StyledTextArea
          rows={1}
          placeholder={t('Leave your comments here...')}
          value={comment}
          onChange={e => setComment(e.target.value)}
          disabled={isLoading || isSubmitted}
        />

        {isSubmitted ? (
          <ThankYouMessage>{t('Thank you for your feedback!')}</ThankYouMessage>
        ) : (
          <FlexRow>
            <StyledButton
              onClick={handleClose}
              buttonStyle="tertiary"
              disabled={isLoading}
            >
              {t('Close')}
            </StyledButton>
            <StyledButton
              buttonStyle="primary"
              onClick={handleSubmit}
              disabled={!rating || isLoading}
              loading={isLoading}
            >
              {t('Submit')}
            </StyledButton>
          </FlexRow>
        )}
      </InnerContainer>

      {isFolded && (
        <UnfoldButton
          role="button"
          onClick={toggleFolding}
          tabIndex={0}
          isFolded={isFolded}
          aria-label={t('To unfold')}
          title={t('To unfold')}
        >
          <Icons.ArrowRightOutlined />
        </UnfoldButton>
      )}
    </Container>
  );
};

const FeedbackForm = ({ dashboardId }: IProps) => {
  const [data, setData] = useState<FeedbackFormContentProps['data'] | null>(
    null,
  );

  const userId = useSelector<RootState, number | undefined>(
    ({ user }) => user.userId,
  );

  const currentStorage: Record<number, string> = JSON.parse(
    localStorage.getItem(`${CSI_LOCALSTORAGE_KEY}`) || '{}',
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!dashboardId || !userId) return;

      const closedDate = currentStorage[dashboardId];

      if (closedDate) {
        const closedDateObj = new Date(closedDate);
        const now = new Date();
        const diff = now.getTime() - closedDateObj.getTime();
        const diffInDays = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (diffInDays < 1) return;
      }

      // SupersetClient.get({
      //   endpoint: `/api/v1/dashboard/${dashboardId}`,
      // }).then(response => {
      //   setData(response.json.result);
      // });
      await new Promise(resolve => {
        setTimeout(resolve, 1000);
      });

      setData({
        message:
          'Please, rate this dashboard according to ease-to-use, data filling, easy-to-find data, and overall performance.',
      });

      delete currentStorage[dashboardId];
      localStorage.setItem(
        CSI_LOCALSTORAGE_KEY,
        JSON.stringify(currentStorage),
      );
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardId, userId]);

  if (!dashboardId || !userId || !data) return null;

  return (
    <FeedbackFormContent
      dashboardId={dashboardId}
      currentStorage={currentStorage}
      data={data}
    />
  );
};

export default FeedbackForm;
