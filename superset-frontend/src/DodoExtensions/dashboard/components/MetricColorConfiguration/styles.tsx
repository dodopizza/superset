import { styled, css } from '@superset-ui/core';
import { Pagination, Card } from 'antd';

export const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionsWrapper = styled.div`
  margin-top: auto; /* Push to bottom of flex container */
  margin-bottom: 0;
  display: flex;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.gridUnit * 3}px;
  padding: ${({ theme }) => theme.gridUnit * 2}px
    ${({ theme }) => theme.gridUnit * 3}px;
  background-color: ${({ theme }) => theme.colors.grayscale.light4};
  border-radius: 0 0 ${({ theme }) => theme.borderRadius}px
    ${({ theme }) => theme.borderRadius}px;
  width: 100%;
  align-self: flex-end;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.primary.base};
    cursor: pointer;
    font-size: ${({ theme }) => theme.typography.sizes.s}px;
    padding: ${({ theme }) => theme.gridUnit}px
      ${({ theme }) => theme.gridUnit * 2}px;
    border-radius: ${({ theme }) => theme.borderRadius}px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.grayscale.light3};
      text-decoration: none;
    }
  }
`;

export const LabelWrapper = styled.div<{ existOnDashboard: boolean }>`
  display: flex;
  align-items: center;

  p {
    color: ${({ theme, existOnDashboard }) =>
      existOnDashboard ? 'inherit' : theme.colors.grayscale.light1};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    flex-grow: 1;
    max-height: 22px;
    word-break: break-all;
  }
`;

export const ColorScheme = styled.p`
  padding: ${({ theme }) => theme.gridUnit * 2}px;
  background-color: ${({ theme }) => theme.colors.alert.light1};
  border-radius: ${({ theme }) => theme.borderRadius}px;
`;

export const BoldText = styled.span`
  font-weight: bold;
`;

export const StyledPagination = styled(Pagination)`
  min-width: fit-content;
`;

// New styled components for card-based layout
export const MetricsContainer = styled.div<{ colorScheme: string | undefined }>`
  margin-top: ${({ theme }) => theme.gridUnit * 4}px;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  max-height: calc(
    100dvh - ${({ colorScheme }) => (colorScheme ? 300 : 230)}px
  );
`;

export const MetricCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.gridUnit * 4}px;
  margin-bottom: ${({ theme }) => theme.gridUnit * 4}px;
  padding: ${({ theme }) => theme.gridUnit}px;
`;

export const StyledCard = styled(Card)<{ isAltered: boolean }>`
  transition: all 0.2s ease;
  height: 100%;
  display: flex;
  flex-direction: column;

  .ant-card-body {
    padding: ${({ theme }) => theme.gridUnit * 3}px 0 0;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .ant-card-head {
    padding: 0 ${({ theme }) => theme.gridUnit * 3}px;
  }

  ${({ theme, isAltered }) =>
    isAltered &&
    css`
      border-color: ${theme.colors.primary.base};

      .ant-card-head {
        background-color: ${theme.colors.primary.light4};
      }
    `}

  &:hover {
    box-shadow: 0 2px 8px ${({ theme }) => theme.colors.grayscale.light3};

    .actions {
      opacity: 1;
    }
  }
`;

export const CardTitle = styled.div<{ hasTooltip?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 0; /* This is important for flex child to respect parent width */
  position: relative;
  padding-left: ${({ hasTooltip }) => (hasTooltip ? '24px' : '0')};
`;

export const MetricName = styled.span<{ existOnDashboard: boolean }>`
  font-weight: ${({ theme }) => theme.typography.weights.bold};
  color: ${({ theme, existOnDashboard }) =>
    existOnDashboard ? 'inherit' : theme.colors.grayscale.light1};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  min-width: 0; /* This is important for text-overflow to work */
`;

export const ColorRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gridUnit * 4}px; /* 16px gap */
  margin-top: ${({ theme }) => theme.gridUnit * 2}px;
  margin-bottom: ${({ theme }) => theme.gridUnit * 2}px;
  padding: 0 ${({ theme }) => theme.gridUnit * 3}px; /* Same as card head padding */
  min-height: ${({ theme }) =>
    theme.gridUnit * 8}px; /* Ensure consistent height */
`;

export const ColorLabel = styled.span`
  color: ${({ theme }) => theme.colors.grayscale.dark1};
  white-space: nowrap;
`;

export const ColorValue = styled.span`
  color: ${({ theme }) => theme.colors.grayscale.dark1};
  margin-left: ${({ theme }) =>
    theme.gridUnit * 2}px; /* 8px gap between picker and value */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// StyledTabs removed as we no longer use tabs

export const ChangeIndicator = styled.span`
  display: inline-block;
  font-size: 11px;
  background-color: ${({ theme }) => theme.colors.primary.base};
  color: ${({ theme }) => theme.colors.grayscale.light5};
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  font-weight: normal;
  flex-shrink: 0; /* Prevent the indicator from shrinking */
`;

export const TooltipContainer = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
`;

export const UsageRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.gridUnit * 2}px;
  margin-bottom: ${({ theme }) => theme.gridUnit * 2}px;
  padding: 0 ${({ theme }) => theme.gridUnit * 3}px; /* Same as card head padding */
  overflow-y: auto; /* Add scrolling for very tall content */
  max-height: 80px; /* Limit height to prevent pushing ActionsWrapper too far */
`;

export const ChartLabel = styled.span`
  color: ${({ theme }) => theme.colors.primary.base};
  background-color: ${({ theme }) => theme.colors.primary.light4};
  padding: ${({ theme }) => theme.gridUnit / 2}px
    ${({ theme }) => theme.gridUnit}px;
  border-radius: ${({ theme }) => theme.gridUnit}px;
  font-size: ${({ theme }) => theme.typography.sizes.s}px;
  white-space: nowrap;
  margin-right: ${({ theme }) => theme.gridUnit}px;
  margin-bottom: ${({ theme }) => theme.gridUnit}px;
  display: inline-block;
  cursor: default;
  max-width: 200px; /* Limit width to prevent very long chart names */
  overflow: hidden;
  text-overflow: ellipsis;
`;
