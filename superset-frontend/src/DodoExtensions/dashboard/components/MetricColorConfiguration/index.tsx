import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Input } from 'antd';
import {
  ChartDataResponseResult,
  isSavedMetric,
  PlainObject,
  t,
} from '@superset-ui/core';
import Button from 'src/components/Button';
import Icons from 'src/components/Icons';
import Modal from 'src/components/Modal';
import { ChartState } from 'src/explore/types';
import ColorPickerControlDodo from 'src/DodoExtensions/explore/components/controls/ColorPickerControlDodo';
import { saveLabelColorsSettings } from 'src/dashboard/actions/dashboardInfo';
import { Tooltip } from 'src/components/Tooltip';
import {
  ActionsWrapper,
  BoldText,
  ColorScheme,
  ColorWrapper,
  Label,
  StyledList,
  StyledListItem,
} from './styles';

interface IProps {
  charts: { [key: number]: ChartState };
  labelColors: PlainObject;
  colorScheme: string | undefined;
}

const MetricColorConfiguration = ({
  charts = [],
  labelColors = {},
  colorScheme,
}: IProps) => {
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState('');
  const [newLabelColors, setNewLabelColors] = useState<PlainObject>({});
  const [deletedLabels, setDeletedLabels] = useState<Record<string, 'true'>>(
    {},
  );
  const currentLabelColorsRef = useRef<PlainObject>(labelColors);
  const dispatch = useDispatch();

  const openModal = () => {
    currentLabelColorsRef.current = labelColors;
    setShow(true);
  };
  const closeModal = () => {
    // reset changes
    setNewLabelColors({});
    setDeletedLabels({});

    setShow(false);
  };

  const handleChangeColor = (metric: string) => (color: string) => {
    setNewLabelColors(prev => ({ ...prev, ...{ [metric]: color } }));
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

  const dashboardMetrics = Object.values(charts).reduce(
    (result: string[], chart) => {
      if (!chart.queriesResponse) return result;

      (chart.queriesResponse as ChartDataResponseResult[]).forEach(response => {
        if (response.colnames && Array.isArray(response.colnames))
          result.push(...response.colnames);

        const groupby = chart.latestQueryFormData?.groupby;
        const hasGroupby = groupby?.length;
        if (hasGroupby && Array.isArray(groupby)) {
          const metricNames = groupby?.map(metric =>
            isSavedMetric(metric) ? metric : metric.label ?? '',
          );

          response.data.forEach(entry => {
            metricNames?.forEach(metric => {
              const metricValue = entry[metric];
              if (
                metricValue &&
                (typeof metricValue === 'string' ||
                  typeof metricValue === 'number')
              )
                result.push(String(metricValue));
            });
          });
        }
      });

      return result;
    },
    [],
  );
  const dashboardMetricsSet = new Set(dashboardMetrics);

  const allMetrics = [
    ...Object.keys(currentLabelColorsRef.current).sort(
      (a, b) =>
        Number(dashboardMetricsSet.has(a)) - Number(dashboardMetricsSet.has(b)),
    ),
    ...dashboardMetrics,
  ];
  const uniqueMetrics = Array.from(new Set(allMetrics));

  const mergedLabelColors = {
    ...currentLabelColorsRef.current,
    ...newLabelColors,
  };

  const filteredMetrics = uniqueMetrics.filter(metric =>
    metric.toLowerCase().includes(search),
  );

  const handleSave = async () => {
    const finalLabelColors = { ...mergedLabelColors };
    const deletedLabelsArray = Object.keys(deletedLabels);

    // remove deleted labels from finalLabelColors
    deletedLabelsArray.forEach(label => {
      delete finalLabelColors[label];
    });

    await dispatch(saveLabelColorsSettings(finalLabelColors));
    currentLabelColorsRef.current = finalLabelColors;
    setNewLabelColors({});
    setShow(false);
  };

  const footer = (
    <>
      <Button buttonSize="small" onClick={closeModal}>
        {t('Cancel')}
      </Button>
      <Button
        buttonSize="small"
        buttonStyle="primary"
        onClick={handleSave}
        disabled={
          Object.keys(newLabelColors).length === 0 &&
          Object.keys(deletedLabels).length === 0
        }
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
        title={t('Edit label colors')}
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

        <Input.Search
          placeholder={t('Search for label')}
          allowClear
          size="middle"
          onChange={e => setSearch(e.target.value.toLowerCase())}
        />

        <StyledList
          dataSource={filteredMetrics}
          colorScheme={colorScheme}
          renderItem={(label: string) => {
            const existOnDashboard = dashboardMetricsSet.has(label);
            const isColorChanged = Boolean(newLabelColors[label]);
            const isDeleted = Boolean(deletedLabels[label]);
            const isAltered = isColorChanged || isDeleted;
            const hasCurrentColor = currentLabelColorsRef.current[label];
            const hasActions = hasCurrentColor || isAltered;
            return (
              <StyledListItem key={label} isAltered={isAltered}>
                <Tooltip
                  title={
                    existOnDashboard
                      ? ''
                      : t(
                          'Metric is missing from the dashboard with current filters or removed from the dataset',
                        )
                  }
                >
                  <Label existOnDashboard={existOnDashboard}>{label}</Label>
                </Tooltip>
                <ColorWrapper>
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
                  <p>
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
                </ColorWrapper>
              </StyledListItem>
            );
          }}
        />
      </Modal>
    </>
  );
};

export default MetricColorConfiguration;
