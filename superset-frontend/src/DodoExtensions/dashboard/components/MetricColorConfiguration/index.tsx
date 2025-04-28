import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from 'antd';
import {
  ChartDataResponseResult,
  isSavedMetric,
  PlainObject,
  t,
} from '@superset-ui/core';
import Badge from 'src/components/Badge';
import Button from 'src/components/Button';
import Icons from 'src/components/Icons';
import InfoTooltip from 'src/components/InfoTooltip';
import Modal from 'src/components/Modal';
import { ChartState } from 'src/explore/types';
import ColorPickerControlDodo from 'src/DodoExtensions/explore/components/controls/ColorPickerControlDodo';
import { saveLabelColorsSettings } from 'src/dashboard/actions/dashboardInfo';
import Loading from 'src/components/Loading';
import { useDebounceValue } from 'src/hooks/useDebounceValue';
import { bootstrapData } from 'src/preamble';
import {
  ActionsWrapper,
  BoldText,
  ColorScheme,
  FlexWrapper,
  LabelWrapper,
  StyledList,
  StyledListItem,
  StyledPagination,
} from './styles';

const ITEMS_PER_PAGE = 30;
const locale = bootstrapData?.common?.locale || 'en';

const exploreJsonVizes: Record<string, 'true'> = {
  bubble: 'true',
};

interface IProps {
  charts: { [key: number]: ChartState };
  labelColors: PlainObject;
  colorScheme: string | undefined;
  // Добавляем информацию о наборах данных для получения переводов
  datasources?: Record<string, any>;
}

const MetricColorConfiguration = ({
  charts = {},
  labelColors = {},
  colorScheme,
  datasources = {},
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

  // Memoized dashboard metrics calculation
  const dashboardMetrics = useMemo(
    () =>
      Object.values(charts).reduce((result: string[], chart) => {
        if (!chart.queriesResponse) return result;

        (chart.queriesResponse as ChartDataResponseResult[]).forEach(
          response => {
            const vizType = chart.latestQueryFormData.viz_type;
            if (vizType === 'table' || vizType === 'pivot_table_v2') return;

            if (response.colnames && Array.isArray(response.colnames)) {
              result.push(...response.colnames);
            }

            const metricsForDataIteration = [];

            if (Array.isArray(chart.latestQueryFormData?.groupby)) {
              metricsForDataIteration.push(
                ...chart.latestQueryFormData?.groupby,
              );
            }

            // bubble_v2
            if (chart.latestQueryFormData?.series) {
              metricsForDataIteration.push(chart.latestQueryFormData.series);
            }

            // sankey_v2
            if (chart.latestQueryFormData?.source) {
              metricsForDataIteration.push(chart.latestQueryFormData.source);
            }

            // graph_chart
            if (chart.latestQueryFormData?.target) {
              metricsForDataIteration.push(chart.latestQueryFormData.target);
            }

            // sunburst_v2
            if (Array.isArray(chart.latestQueryFormData?.columns)) {
              metricsForDataIteration.push(
                ...chart.latestQueryFormData.columns,
              );
            }

            // explore json vizes
            if (exploreJsonVizes[vizType || '']) {
              metricsForDataIteration.push('key');
            }

            if (metricsForDataIteration.length) {
              const metricNames = metricsForDataIteration.map(metric =>
                isSavedMetric(metric) ? metric : metric.label ?? '',
              );

              response.data.forEach(entry => {
                metricNames.forEach(metric => {
                  const metricValue = Array.isArray(entry[metric])
                    ? entry[metric].join(', ')
                    : entry[metric];
                  if (
                    metricValue &&
                    (typeof metricValue === 'string' ||
                      typeof metricValue === 'number')
                  ) {
                    result.push(String(metricValue));
                  }
                });
              });
            }
          },
        );

        return result;
      }, []),
    [charts],
  );

  const dashboardMetricsSet = useMemo(
    () => new Set(dashboardMetrics),
    [dashboardMetrics],
  );

  // Создаем словарь переводов для метрик и колонок
  const translationsMap = useMemo(() => {
    const translations: Record<string, string> = {};

    // Собираем переводы из всех наборов данных
    Object.values(datasources).forEach(datasource => {
      // Добавляем переводы для метрик
      if (Array.isArray(datasource?.metrics)) {
        datasource.metrics.forEach((metric: any) => {
          // Для русского языка используем verbose_name_ru
          if (locale === 'ru' && metric.metric_name && metric.verbose_name_ru) {
            translations[metric.metric_name] = metric.verbose_name_ru;
          }
          // Для английского и других языков используем verbose_name
          else if (metric.metric_name && metric.verbose_name && metric.metric_name !== metric.verbose_name) {
            translations[metric.metric_name] = metric.verbose_name;
          }

          // Если метрика отображается по имени, но у нее есть verbose_name
          if (metric.verbose_name && metric.metric_name !== metric.verbose_name) {
            translations[metric.verbose_name] = locale === 'ru' && metric.verbose_name_ru
              ? metric.verbose_name_ru
              : metric.metric_name;
          }
        });
      }

      // Добавляем переводы для колонок
      if (Array.isArray(datasource?.columns)) {
        datasource.columns.forEach((column: any) => {
          // Для русского языка используем verbose_name_ru
          if (locale === 'ru' && column.column_name && column.verbose_name_ru) {
            translations[column.column_name] = column.verbose_name_ru;
          }
          // Для английского и других языков используем verbose_name
          else if (column.column_name && column.verbose_name && column.column_name !== column.verbose_name) {
            translations[column.column_name] = column.verbose_name;
          }

          // Если колонка отображается по имени, но у нее есть verbose_name
          if (column.verbose_name && column.column_name !== column.verbose_name) {
            translations[column.verbose_name] = locale === 'ru' && column.verbose_name_ru
              ? column.verbose_name_ru
              : column.column_name;
          }
        });
      }

      // Добавляем переводы из verbose_map, если он есть
      if (datasource?.verbose_map) {
        Object.entries(datasource.verbose_map).forEach(([key, value]) => {
          if (key && value && !translations[key]) {
            translations[key] = String(value);
          }
        });
      }
    });

    return translations;
  }, [datasources]);

  // Memoized unique metrics list
  const uniqueMetrics = useMemo(() => {
    const allMetrics = [
      ...Object.keys(labelColors).sort(
        (a, b) =>
          Number(dashboardMetricsSet.has(a)) -
          Number(dashboardMetricsSet.has(b)),
      ),
      ...dashboardMetrics,
    ];
    return Array.from(new Set(allMetrics));
  }, [dashboardMetrics, labelColors, dashboardMetricsSet]);

  const filteredMetrics = useMemo(
    () =>
      uniqueMetrics.filter(metric => {
        const searchLower = debouncedSearch.toLowerCase();
        // Ищем как в оригинальном названии, так и в переводе
        return (
          metric.toLowerCase().includes(searchLower) ||
          translationsMap[metric]?.toLowerCase().includes(searchLower) || false
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
    resetChanges();
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

  const handleSave = () => {
    const finalLabelColors = { ...mergedLabelColors };
    // remove deleted labels from finalLabelColors
    Object.keys(deletedLabels).forEach(label => delete finalLabelColors[label]);

    setIsLoading(true);
    dispatch(saveLabelColorsSettings(finalLabelColors));
    // Устанавливаем таймаут для завершения операции
    setTimeout(() => {
      setIsLoading(false);
      setShow(false);
    }, 500);
  };

  const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const changesCount =
    Object.keys(newLabelColors).length + Object.keys(deletedLabels).length;

  const modalTitle = (
    <FlexWrapper>
      <span>{t('Edit label colors')}</span>
      <Badge count={changesCount} title={t('Number of changes')} />
    </FlexWrapper>
  );

  const footer = (
    <>
      <Button buttonSize="small" onClick={() => setShow(false)}>
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
        onHide={() => setShow(false)}
        width="550px"
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

        <StyledList
          dataSource={paginatedMetrics}
          colorScheme={colorScheme}
          renderItem={(label: string) => {
            const existOnDashboard = dashboardMetricsSet.has(label);
            const isColorChanged = Boolean(newLabelColors[label]);
            const isDeleted = Boolean(deletedLabels[label]);
            const isAltered = isColorChanged || isDeleted;
            const hasCurrentColor = labelColors[label];
            const hasActions = hasCurrentColor || isAltered;

            return (
              <StyledListItem key={label} isAltered={isAltered}>
                <LabelWrapper existOnDashboard={existOnDashboard}>
                  {!existOnDashboard && (
                    <InfoTooltip
                      tooltip={t(
                        'Metric is missing from the dashboard with current filters or removed from the dataset',
                      )}
                      placement="top"
                    />
                  )}
                  <p title={label}>{translationsMap[label] || label}</p>
                </LabelWrapper>

                <FlexWrapper>
                  {hasActions && (
                    <ActionsWrapper className="actions">
                      {isAltered && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={handleReset(
                            label,
                            isColorChanged,
                            isDeleted,
                          )}
                        >
                          <Icons.UndoOutlined />
                        </span>
                      )}
                      {hasCurrentColor && !isDeleted && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={handleDelete(label)}
                        >
                          <Icons.Trash />
                        </span>
                      )}
                    </ActionsWrapper>
                  )}

                  <p className="color-current">
                    {isDeleted
                      ? t('Deleted')
                      : mergedLabelColors[label] || t('Not assigned')}
                  </p>

                  <ColorPickerControlDodo
                    value={isDeleted ? undefined : mergedLabelColors[label]}
                    onChange={handleChangeColor(label)}
                    previewWidth="50px"
                    disabled={isDeleted}
                    isHex
                  />
                </FlexWrapper>
              </StyledListItem>
            );
          }}
        />

        {isLoading && <Loading />}
      </Modal>
    </>
  );
};

export default MetricColorConfiguration;
