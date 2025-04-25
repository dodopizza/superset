import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
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

interface IProps {
  charts: { [key: number]: ChartState };
  labelColors: PlainObject;
  colorScheme: string | undefined;
}

const MetricColorConfiguration = ({
  charts = {},
  labelColors = {},
  colorScheme,
}: IProps) => {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [newLabelColors, setNewLabelColors] = useState<PlainObject>({});
  const [deletedLabels, setDeletedLabels] = useState<Record<string, 'true'>>(
    {},
  );
  const [currentPage, setCurrentPage] = useState(1);
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
            if (response.colnames && Array.isArray(response.colnames)) {
              result.push(...response.colnames);
            }

            const groupby = chart.latestQueryFormData?.groupby;
            if (Array.isArray(groupby)) {
              const metricNames = groupby.map(metric =>
                isSavedMetric(metric) ? metric : metric.label ?? '',
              );

              response.data.forEach(entry => {
                metricNames.forEach(metric => {
                  const metricValue = entry[metric];
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
    () => uniqueMetrics.filter(metric => metric.toLowerCase().includes(search)),
    [uniqueMetrics, search],
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

  const closeModal = () => {
    resetChanges();
    setShow(false);
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
          const { [label]: _, ...rest } = prev;
          return rest;
        });
      }
      // reset changed color
      if (isColorChanged) {
        setNewLabelColors(prev => {
          const { [label]: _, ...rest } = prev;
          return rest;
        });
      }
    };

  const handleSave = async () => {
    const finalLabelColors = { ...mergedLabelColors };
    // remove deleted labels from finalLabelColors
    Object.keys(deletedLabels).forEach(label => delete finalLabelColors[label]);

    await dispatch(saveLabelColorsSettings(finalLabelColors));

    resetChanges();
    setShow(false);
  };

  const debouncedOnChangeSearch = debounce((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, 500);

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
      <Button buttonSize="small" onClick={closeModal}>
        {t('Cancel')}
      </Button>
      <Button
        buttonSize="small"
        buttonStyle="primary"
        onClick={handleSave}
        disabled={changesCount === 0}
      >
        {t('Save')}
      </Button>
    </>
  );

  return (
    <>
      <Button
        buttonStyle="secondary"
        onClick={() => setShow(true)}
        className="action-button"
        aria-label={t('Edit colors')}
      >
        {t('Edit colors')}
      </Button>

      <Modal
        show={show}
        title={modalTitle}
        footer={footer}
        onHide={closeModal}
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
            placeholder={t('Search for label')}
            allowClear
            size="middle"
            onChange={e =>
              debouncedOnChangeSearch(e.target.value.toLowerCase())
            }
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
                  <p title={label}>{label}</p>
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
      </Modal>
    </>
  );
};

export default MetricColorConfiguration;
