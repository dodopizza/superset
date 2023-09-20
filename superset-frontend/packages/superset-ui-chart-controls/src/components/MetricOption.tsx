// DODO was here
import React, { useState, ReactNode, useLayoutEffect } from 'react';
import {
  css,
  styled,
  Metric,
  SafeMarkdown,
  SupersetTheme,
} from '@superset-ui/core';
import InfoTooltipWithTrigger from './InfoTooltipWithTrigger';
import { ColumnTypeLabel } from './ColumnTypeLabel/ColumnTypeLabel';
import CertifiedIconWithTooltip from './CertifiedIconWithTooltip';
import Tooltip from './Tooltip';
import { getMetricTooltipNode } from './labelUtils';
import { SQLPopover } from './SQLPopover';

const FlexRowContainer = styled.div`
  align-items: center;
  display: flex;

  > svg {
    margin-right: ${({ theme }) => theme.gridUnit}px;
  }
`;

export interface MetricOptionProps {
  metric: Omit<Metric, 'id'> & { label?: string };
  openInNewWindow?: boolean;
  showFormula?: boolean;
  showType?: boolean;
  url?: string;
  labelRef?: React.RefObject<any>;
  shouldShowTooltip?: boolean;
  primaryLanguage: string;
}

export function MetricOption({
  metric,
  labelRef,
  openInNewWindow = false,
  showFormula = true,
  showType = false,
  shouldShowTooltip = true,
  url = '',
  primaryLanguage,
}: MetricOptionProps) {
  let verbose = null;
  let verboseTemp = null;

  if (primaryLanguage) {
    // @ts-ignore
    verboseTemp = metric.verbose_name_2nd_lang;
  }

  if (!verboseTemp) {
    verbose = metric.verbose_name || metric.metric_name || metric.label;
  } else {
    verbose = verboseTemp;
  }

  console.log('verboseXX', verbose);
  console.log('metricXX', metric);

  const link = url ? (
    <a href={url} target={openInNewWindow ? '_blank' : ''} rel="noreferrer">
      {verbose}
    </a>
  ) : (
    verbose
  );

  const label = (
    <span
      className="option-label metric-option-label"
      css={(theme: SupersetTheme) =>
        css`
          margin-right: ${theme.gridUnit}px;
        `
      }
      ref={labelRef}
    >
      {link}
    </span>
  );

  const warningMarkdown = metric.warning_markdown || metric.warning_text;

  const [tooltipText, setTooltipText] = useState<ReactNode>(metric.metric_name);

  useLayoutEffect(() => {
    setTooltipText(getMetricTooltipNode(metric, labelRef));
  }, [labelRef, metric]);

  return (
    <FlexRowContainer className="metric-option">
      {showType && <ColumnTypeLabel type="expression" />}
      {shouldShowTooltip ? (
        <Tooltip id="metric-name-tooltip" title={tooltipText}>
          {label}
        </Tooltip>
      ) : (
        label
      )}
      {showFormula && metric.expression && (
        <SQLPopover sqlExpression={metric.expression} />
      )}
      {metric.is_certified && (
        <CertifiedIconWithTooltip
          metricName={metric.metric_name}
          certifiedBy={metric.certified_by}
          details={metric.certification_details}
        />
      )}
      {warningMarkdown && (
        <InfoTooltipWithTrigger
          className="text-warning"
          icon="warning"
          tooltip={<SafeMarkdown source={warningMarkdown} />}
          label={`warn-${metric.metric_name}`}
          iconsStyle={{ marginLeft: 0 }}
        />
      )}
    </FlexRowContainer>
  );
}
