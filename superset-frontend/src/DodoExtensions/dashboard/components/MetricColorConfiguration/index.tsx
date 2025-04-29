import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from 'antd';
import { PlainObject, t, tn } from '@superset-ui/core';
import Badge from 'src/components/Badge';
import Button from 'src/components/Button';
import InfoTooltip from 'src/components/InfoTooltip';
import Modal from 'src/components/Modal';
import { ChartState } from 'src/explore/types';
import ColorPickerControlDodo from 'src/DodoExtensions/explore/components/controls/ColorPickerControlDodo';
import { saveLabelColorsSettings } from 'src/dashboard/actions/dashboardInfo';
import Loading from 'src/components/Loading';
import { useDebounceValue } from 'src/hooks/useDebounceValue';
import { DashboardLayout, DatasourcesState } from 'src/dashboard/types';
import { processDashboardCharts, getTranslationsMap } from './utils';
import {
  ActionsWrapper,
  BoldText,
  CardTitle,
  ChangeIndicator,
  ChartLabel,
  ColorLabel,
  ColorRow,
  ColorScheme,
  ColorValue,
  FlexWrapper,
  MetricCardsGrid,
  MetricName,
  MetricsContainer,
  StyledCard,
  StyledPagination,
  TooltipContainer,
  UsageRow,
} from './styles';

const ITEMS_PER_PAGE = 30;

interface IProps {
  charts: { [key: number]: ChartState };
  labelColors: PlainObject;
  colorScheme: string | undefined;
  datasources?: DatasourcesState;
  dashboardLayout?: DashboardLayout;
}

const MetricColorConfiguration = ({
  charts = {},
  labelColors = {},
  colorScheme,
  datasources = {},
  dashboardLayout = {},
}: IProps) => {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounceValue(search, 500);
  const [newLabelColors, setNewLabelColors] = useState<PlainObject>({});
  const [deletedLabels, setDeletedLabels] = useState<Record<string, 'true'>>(
    {},
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const mergedLabelColors = useMemo(
    () => ({ ...labelColors, ...newLabelColors }),
    [labelColors, newLabelColors],
  );

  // Process dashboard charts to get metrics and charts map in one pass
  const { dashboardMetricsSet, metricsToChartsMap } = useMemo(
    () => processDashboardCharts(charts, dashboardLayout),
    [charts, dashboardLayout],
  );

  // Create translations map for metrics and columns
  const translationsMap = useMemo(
    () => getTranslationsMap(datasources),
    [datasources],
  );

  // Memoized unique metrics list
  const uniqueMetrics = useMemo(() => {
    const allMetrics = [
      ...Object.keys(labelColors).sort(
        (a, b) =>
          Number(dashboardMetricsSet.has(a)) -
          Number(dashboardMetricsSet.has(b)),
      ),
      ...dashboardMetricsSet,
    ];
    return Array.from(new Set(allMetrics));
  }, [labelColors, dashboardMetricsSet]);

  const filteredMetrics = useMemo(
    () =>
      uniqueMetrics.filter(metric => {
        const searchLower = debouncedSearch.toLowerCase();
        // Search in both original title and translation
        return (
          metric.toLowerCase().includes(searchLower) ||
          translationsMap[metric]?.toLowerCase().includes(searchLower) ||
          false
        );
      }),
    [uniqueMetrics, debouncedSearch, translationsMap],
  );

  const paginatedMetrics = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredMetrics.slice(startIndex, endIndex);
  }, [filteredMetrics, currentPage]);

  const resetChanges = () => {
    setNewLabelColors({});
    setDeletedLabels({});
    setSearch('');
    setCurrentPage(1);
  };

  const openModal = () => {
    setShow(true);
  };

  const handleChangeColor = (metric: string) => (color: string) => {
    setNewLabelColors(prev => ({ ...prev, [metric]: color }));
  };

  const handleDelete = (label: string) => () => {
    setDeletedLabels(prev => ({ ...prev, [label]: 'true' }));
  };

  const handleReset =
    (label: string, isColorChanged: boolean, isDeleted: boolean) => () => {
      // reset deletion
      if (isDeleted) {
        setDeletedLabels(prev => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [label]: removed, ...rest } = prev;
          return rest;
        });
      }
      // reset changed color
      if (isColorChanged) {
        setNewLabelColors(prev => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [label]: removed, ...rest } = prev;
          return rest;
        });
      }
    };

  const handleSave = async () => {
    const finalLabelColors = { ...mergedLabelColors };
    // remove deleted labels from finalLabelColors
    Object.keys(deletedLabels).forEach(label => delete finalLabelColors[label]);

    setIsLoading(true);
    await dispatch(saveLabelColorsSettings(finalLabelColors));
    setIsLoading(false);

    resetChanges();
    setShow(false);
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  // Count only unique keys between newLabelColors and deletedLabels
  const changesCount = new Set([
    ...Object.keys(newLabelColors),
    ...Object.keys(deletedLabels),
  ]).size;

  const modalTitle = (
    <FlexWrapper>
      <span>{t('Edit label colors')}</span>
      <Badge
        count={
          changesCount > 0
            ? `${changesCount} ${tn('changes', 'changes', changesCount)}`
            : 0
        }
        title={t('Number of changes')}
      />
    </FlexWrapper>
  );

  const handleCancel = () => {
    resetChanges();
    setShow(false);
  };

  const footer = (
    <>
      <Button buttonSize="small" onClick={handleCancel}>
        {t('Cancel')}
      </Button>
      <Button
        buttonSize="small"
        buttonStyle="primary"
        onClick={handleSave}
        disabled={changesCount === 0 || isLoading || isLoading}
      >
        {t('Save')}
      </Button>
    </>
  );

  // Get metric data for display and interaction
  const getMetricData = (label: string) => {
    const existOnDashboard = dashboardMetricsSet.has(label);
    const isColorChanged = Boolean(newLabelColors[label]);
    const isDeleted = Boolean(deletedLabels[label]);
    const isAltered = isColorChanged || isDeleted;
    const hasCurrentColor = labelColors[label];
    const hasActions = hasCurrentColor || isAltered;
    const usedInCharts = metricsToChartsMap[label] || [];

    return {
      label,
      existOnDashboard,
      isColorChanged,
      isDeleted,
      isAltered,
      hasCurrentColor,
      hasActions,
      usedInCharts,
      displayName: translationsMap[label] || label,
      colorValue: isDeleted
        ? t('Deleted')
        : mergedLabelColors[label] || t('Not assigned'),
    };
  };

  return (
    <>
      <Button
        buttonStyle="secondary"
        onClick={openModal}
        className="action-button"
        aria-label={t('Edit colors')}
      >
        {t('Edit colors')}
      </Button>

      <Modal
        show={show}
        title={modalTitle}
        footer={footer}
        onHide={() => {
          resetChanges();
          setShow(false);
        }}
        width="800px"
        responsive
      >
        {colorScheme && (
          <ColorScheme>
            {t('The dashboard has a color scheme applied: ')}
            <BoldText>{colorScheme}</BoldText>
            {'. '}
            {t(
              'You can override the colors of the metrics with your own values.',
            )}
          </ColorScheme>
        )}

        <FlexWrapper>
          <Input.Search
            value={search}
            onChange={onChangeSearch}
            placeholder={t('Search for label')}
            allowClear
            size="middle"
          />
          <StyledPagination
            current={currentPage}
            total={filteredMetrics.length}
            pageSize={ITEMS_PER_PAGE}
            onChange={setCurrentPage}
            showSizeChanger={false}
            size="small"
            simple
          />
        </FlexWrapper>

        <MetricsContainer colorScheme={colorScheme}>
          <MetricCardsGrid>
            {paginatedMetrics.map(label => {
              const item = getMetricData(label);

              return (
                <StyledCard
                  key={label}
                  isAltered={item.isAltered}
                  title={
                    <CardTitle hasTooltip={!item.existOnDashboard}>
                      {!item.existOnDashboard && (
                        <TooltipContainer>
                          <InfoTooltip
                            tooltip={t(
                              'Metric is missing from the dashboard with current filters or removed from the dataset',
                            )}
                            placement="top"
                          />
                        </TooltipContainer>
                      )}
                      <MetricName
                        existOnDashboard={item.existOnDashboard}
                        title={label}
                      >
                        {item.displayName}
                      </MetricName>
                      {item.isAltered && (
                        <ChangeIndicator>{t('Modified')}</ChangeIndicator>
                      )}
                    </CardTitle>
                  }
                >
                  <ColorRow>
                    <ColorLabel>{t('Color')}:</ColorLabel>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <ColorPickerControlDodo
                        value={
                          item.isDeleted ? undefined : mergedLabelColors[label]
                        }
                        onChange={handleChangeColor(label)}
                        previewWidth="50px"
                        disabled={item.isDeleted}
                        isHex
                      />
                      <ColorValue>{item.colorValue}</ColorValue>
                    </div>
                  </ColorRow>

                  {item.usedInCharts.length > 0 && (
                    <UsageRow>
                      {item.usedInCharts.map(
                        (chart: { id: number; name: string; type: string }) => (
                          <ChartLabel key={chart.id}>
                            {chart.name} ({chart.type})
                          </ChartLabel>
                        ),
                      )}
                    </UsageRow>
                  )}

                  {item.hasActions && (
                    <ActionsWrapper>
                      {item.isAltered && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={handleReset(
                            label,
                            item.isColorChanged,
                            item.isDeleted,
                          )}
                        >
                          {t('Reset')}
                        </span>
                      )}
                      {item.hasCurrentColor && !item.isDeleted && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={handleDelete(label)}
                        >
                          {t('Delete')}
                        </span>
                      )}
                    </ActionsWrapper>
                  )}
                </StyledCard>
              );
            })}
          </MetricCardsGrid>
        </MetricsContainer>

        {isLoading && <Loading />}
      </Modal>
    </>
  );
};

export default MetricColorConfiguration;
