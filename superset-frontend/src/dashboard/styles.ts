// DODO was here
import { css, SupersetTheme } from '@superset-ui/core';

export const headerStyles = (theme: SupersetTheme) => css`
  body {
    h1 {
      font-weight: ${theme.typography.weights.bold};
      line-height: 1.4;
      font-size: ${theme.typography.sizes.xxl}px;
      letter-spacing: -0.2px;
      margin-top: ${theme.gridUnit * 3}px;
      margin-bottom: ${theme.gridUnit * 3}px;
    }

    h2 {
      font-weight: ${theme.typography.weights.bold};
      line-height: 1.4;
      font-size: ${theme.typography.sizes.xl}px;
      margin-top: ${theme.gridUnit * 3}px;
      margin-bottom: ${theme.gridUnit * 2}px;
    }

    h3,
    h4,
    h5,
    h6 {
      font-weight: ${theme.typography.weights.bold};
      line-height: 1.4;
      font-size: ${theme.typography.sizes.l}px;
      letter-spacing: 0.2px;
      margin-top: ${theme.gridUnit * 2}px;
      margin-bottom: ${theme.gridUnit}px;
    }
  }
`;

// adds enough margin and padding so that the focus outline styles will fit
export const chartHeaderStyles = (theme: SupersetTheme) => css`
  // DODO commented out 44120742
  // .header-title a {
  //   margin: ${theme.gridUnit / 2}px;
  //   padding: ${theme.gridUnit / 2}px;
  // }
  .header-controls {
    &,
    &:hover {
      margin-top: ${theme.gridUnit}px;
    }
  }
`;

export const filterCardPopoverStyle = (theme: SupersetTheme) => css`
  .filter-card-popover {
    width: 240px;
    padding: 0;
    border-radius: 4px;

    &.ant-popover-placement-bottom {
      padding-top: ${theme.gridUnit}px;
    }

    &.ant-popover-placement-left {
      padding-right: ${theme.gridUnit * 3}px;
    }

    .ant-popover-inner {
      box-shadow: 0 0 8px rgb(0 0 0 / 10%);
    }

    .ant-popover-inner-content {
      padding: ${theme.gridUnit * 4}px;
    }

    .ant-popover-arrow {
      display: none;
    }
  }

  .filter-card-tooltip {
    &.ant-tooltip-placement-bottom {
      padding-top: 0;
      & .ant-tooltip-arrow {
        top: -13px;
      }
    }
  }
`;

export const chartContextMenuStyles = (theme: SupersetTheme) => css`
  .ant-dropdown-menu.chart-context-menu {
    min-width: ${theme.gridUnit * 43}px;
  }
  .ant-dropdown-menu-submenu.chart-context-submenu {
    max-width: ${theme.gridUnit * 60}px;
    min-width: ${theme.gridUnit * 40}px;
  }
`;

export const focusStyle = (theme: SupersetTheme) => css`
  a,
  .ant-tabs-tabpane,
  .ant-tabs-tab-btn,
  .superset-button,
  .superset-button.ant-dropdown-trigger,
  .header-controls span {
    &:focus-visible {
      box-shadow: 0 0 0 2px ${theme.colors.primary.dark1};
      border-radius: ${theme.gridUnit / 2}px;
      outline: none;
      text-decoration: none;
    }
    &:not(
        .superset-button,
        .ant-menu-item,
        a,
        .fave-unfave-icon,
        .ant-tabs-tabpane,
        .header-controls span
      ) {
      &:focus-visible {
        padding: ${theme.gridUnit / 2}px;
      }
    }
  }
`;
