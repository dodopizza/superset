// DODO was here
import { memo, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { css, t, useTheme, useTruncation } from '@superset-ui/core';
import { bootstrapData } from 'src/preamble'; // DODO added 44211759
import Icons from 'src/components/Icons';
import { setDirectPathToChild } from 'src/dashboard/actions/dashboardState';
import {
  DependencyItem,
  Row,
  RowLabel,
  RowTruncationCount,
  RowValue,
  TooltipList,
} from './Styles';
import { useFilterDependencies } from './useFilterDependencies';
import { DependencyValueProps, FilterCardRowProps } from './types';
import { TooltipWithTruncation } from './TooltipWithTruncation';

const locale = bootstrapData?.common?.locale || 'en'; // DODO added 44211759
const localisedNameField = locale === 'ru' ? 'nameRu' : 'name'; // DODO added 44211759

const DependencyValue = ({
  dependency,
  hasSeparator,
}: DependencyValueProps) => {
  const dispatch = useDispatch();
  const handleClick = useCallback(() => {
    dispatch(setDirectPathToChild([dependency.id]));
  }, [dependency.id, dispatch]);
  return (
    <span>
      {hasSeparator && <span>, </span>}
      <DependencyItem role="button" onClick={handleClick} tabIndex={0}>
        {/* DODO changed 44211759 */}
        {dependency[localisedNameField] || dependency.name || dependency.nameRu}
      </DependencyItem>
    </span>
  );
};

export const DependenciesRow = memo(({ filter }: FilterCardRowProps) => {
  const dependencies = useFilterDependencies(filter);
  const [dependenciesRef, plusRef, elementsTruncated, hasHiddenElements] =
    useTruncation();
  const theme = useTheme();

  const tooltipText = useMemo(
    () =>
      elementsTruncated > 0 && dependencies ? (
        <TooltipList>
          {dependencies.map(dependency => (
            <li key={dependency.id}>
              <DependencyValue dependency={dependency} />
            </li>
          ))}
        </TooltipList>
      ) : null,
    [elementsTruncated, dependencies],
  );

  if (!Array.isArray(dependencies) || dependencies.length === 0) {
    return null;
  }
  return (
    <Row>
      <RowLabel
        css={css`
          display: inline-flex;
          align-items: center;
        `}
      >
        {t('Dependent on')}{' '}
        <TooltipWithTruncation
          title={t(
            'Filter only displays values relevant to selections made in other filters.',
          )}
        >
          <Icons.Info
            iconSize="m"
            iconColor={theme.colors.grayscale.light1}
            css={css`
              margin-left: ${theme.gridUnit}px;
            `}
          />
        </TooltipWithTruncation>
      </RowLabel>
      <TooltipWithTruncation title={tooltipText}>
        <RowValue ref={dependenciesRef}>
          {dependencies.map((dependency, index) => (
            <DependencyValue
              key={dependency.id}
              dependency={dependency}
              hasSeparator={index !== 0}
            />
          ))}
        </RowValue>
        {hasHiddenElements && (
          <RowTruncationCount ref={plusRef}>
            +{elementsTruncated}
          </RowTruncationCount>
        )}
      </TooltipWithTruncation>
    </Row>
  );
});
