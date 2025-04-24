import { styled } from '@superset-ui/core';
import { Pagination } from 'antd';
import { List } from 'src/components';

export const StyledList = styled(List)<{ colorScheme: string | undefined }>`
  overflow-y: auto;
  max-height: calc(
    100dvh - ${({ colorScheme }) => (colorScheme ? 300 : 230)}px
  );
  margin-top: 16px;
  padding-inline: 0;

  p {
    margin: 0;
    white-space: nowrap;
  }
`;

export const StyledListItem = styled(List.Item)<{
  isAltered: boolean;
}>`
  padding-inline: 16px;
  gap: ${({ theme }) => theme.gridUnit * 4}px;
  background-color: ${({ theme, isAltered }) => {
    if (isAltered) return theme.colors.primary.light3;
    return 'transparent';
  }};
  transition: background-color ${({ theme }) => `${theme.transitionTiming}s`};

  &:hover {
    .actions {
      opacity: 1;
    }
  }
`;

export const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ActionsWrapper = styled(FlexWrapper)`
  opacity: 0;
  transition: opacity 0.1s;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  svg {
    width: 20px;
    height: auto;
  }
`;

export const Label = styled.p<{ existOnDashboard: boolean }>`
  color: ${({ theme, existOnDashboard }) =>
    existOnDashboard ? 'inherit' : theme.colors.error.base};
  text-decoration: ${({ existOnDashboard }) =>
    existOnDashboard ? 'none' : 'line-through'};
  overflow: hidden;
  text-overflow: ellipsis;
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
