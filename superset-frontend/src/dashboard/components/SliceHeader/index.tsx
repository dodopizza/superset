// DODO was here
// onClickTitle

import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import { styled, t } from '@superset-ui/core';
import { useUiConfig } from 'src/components/UiConfigContext';
import { Tooltip } from 'src/components/Tooltip';
import { useDispatch, useSelector } from 'react-redux';
import EditableTitle from 'src/components/EditableTitle';
import SliceHeaderControls, {
  SliceHeaderControlsProps,
} from 'src/dashboard/components/SliceHeaderControls';
import FiltersBadge from 'src/dashboard/components/FiltersBadge';
import Icons from 'src/components/Icons';
import { RootState } from 'src/dashboard/types';
import FilterIndicator from 'src/dashboard/components/FiltersBadge/FilterIndicator';
import { clearDataMask } from 'src/dataMask/actions';

type SliceHeaderProps = SliceHeaderControlsProps & {
  innerRef?: string;
  updateSliceName?: (arg0: string) => void;
  updateSliceNameRU?: (arg0: string) => void;
  editMode?: boolean;
  annotationQuery?: object;
  annotationError?: object;
  sliceName?: string;
  sliceNameRU?: string;
  filters: object;
  handleToggleFullSize: () => void;
  formData: object;
  width: number;
  height: number;
  dashboardLanguage: string;
};

const annotationsLoading = t('Annotation layers are still loading.');
const annotationsError = t('One ore more annotation layers failed loading.');
const CrossFilterIcon = styled(Icons.CursorTarget)`
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary.base};
  height: 22px;
  width: 22px;
`;

const SliceHeader: FC<SliceHeaderProps> = ({
  innerRef = null,
  forceRefresh = () => ({}),
  updateSliceName = () => ({}),
  updateSliceNameRU = () => ({}),
  toggleExpandSlice = () => ({}),
  logExploreChart = () => ({}),
  onExploreChart,
  exportCSV = () => ({}),
  exportXLSX = () => ({}),
  editMode = false,
  annotationQuery = {},
  annotationError = {},
  cachedDttm = null,
  updatedDttm = null,
  isCached = [],
  isExpanded = false,
  sliceName = '---',
  sliceNameRU = '---',
  supersetCanExplore = false,
  supersetCanShare = false,
  supersetCanCSV = false,
  sliceCanEdit = false,
  exportFullCSV,
  slice,
  componentId,
  dashboardId,
  addSuccessToast,
  addDangerToast,
  handleToggleFullSize,
  isFullSize,
  chartStatus,
  formData,
  width,
  height,
  dashboardLanguage,
}) => {
  console.log(
    'RT DODO: переводы SliceHeader',
    'dashboardLanguage',
    dashboardLanguage,
    'sliceName',
    sliceName,
    'sliceNameRU',
    sliceNameRU,
  );

  console.log('sliceXXZXZX', slice);
  const dispatch = useDispatch();
  const uiConfig = useUiConfig();
  const [headerTooltip, setHeaderTooltip] = useState<string | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  // TODO: change to indicator field after it will be implemented
  const crossFilterValue = useSelector<RootState, any>(
    state => state.dataMask[slice?.slice_id]?.filterState?.value,
  );

  const indicator = useMemo(
    () => ({
      value: crossFilterValue,
      name: t('Emitted values'),
    }),
    [crossFilterValue],
  );

  const handleClickTitle =
    !editMode && supersetCanExplore ? onExploreChart : undefined;

  // DODO-changed
  useEffect(() => {
    if (process.env.type === undefined) {
      const headerElement = headerRef.current;
      if (handleClickTitle) {
        setHeaderTooltip(
          sliceName
            ? t('Click to edit %s in a new tab', sliceName)
            : t('Click to edit chart in a new tab'),
        );
      } else if (
        headerElement &&
        (headerElement.scrollWidth > headerElement.offsetWidth ||
          headerElement.scrollHeight > headerElement.offsetHeight)
      ) {
        setHeaderTooltip(sliceName ?? null);
      } else {
        setHeaderTooltip(null);
      }
    }
  }, [sliceName, width, height, handleClickTitle]);

  // const sliceFinalTitle =
  //   dashboardLanguage === 'ru' ? sliceNameRU || sliceName : sliceName;
  const TitleWrapper = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: row;
    margin-bottom: 8px;

    span {
      margin-left: 12px;

      &:first-child {
        margin-left: 0;
      }
    }
  `;
  const TitleLabel = styled.span`
    display: inline-block;
    padding: 0;
  `;

  return (
    <div className="chart-header" data-test="slice-header" ref={innerRef}>
      <div className="header-title" ref={headerRef}>
        {editMode && (
          <>
            <TitleWrapper>
              <TitleLabel>EN:</TitleLabel>
              <Tooltip title={headerTooltip}>
                <EditableTitle
                  title={
                    sliceName ||
                    (editMode
                      ? '---' // this makes an empty title clickable
                      : '')
                  }
                  canEdit={editMode}
                  emptyText=""
                  onSaveTitle={updateSliceName}
                  showTooltip={false}
                  // DODO-changed
                  onClickTitle={
                    process.env.type === undefined ? handleClickTitle : () => {}
                  }
                />
              </Tooltip>
            </TitleWrapper>
            <TitleWrapper>
              <TitleLabel>RU:</TitleLabel>
              <Tooltip title={headerTooltip}>
                <EditableTitle
                  title={
                    sliceNameRU ||
                    (editMode
                      ? '---' // this makes an empty title clickable
                      : '')
                  }
                  canEdit={editMode}
                  emptyText=""
                  onSaveTitle={updateSliceNameRU}
                  showTooltip={false}
                  // DODO-changed
                  onClickTitle={
                    process.env.type === undefined ? handleClickTitle : () => {}
                  }
                />
              </Tooltip>
            </TitleWrapper>
          </>
        )}

        {!editMode && dashboardLanguage !== 'ru' && (
          <Tooltip title={headerTooltip}>
            <EditableTitle
              title={
                sliceName ||
                (editMode
                  ? '---' // this makes an empty title clickable
                  : '')
              }
              canEdit={editMode}
              emptyText=""
              onSaveTitle={updateSliceName}
              showTooltip={false}
              // DODO-changed
              onClickTitle={
                process.env.type === undefined ? handleClickTitle : () => {}
              }
            />
          </Tooltip>
        )}

        {!editMode && dashboardLanguage === 'ru' && (
          <Tooltip title={headerTooltip}>
            <EditableTitle
              title={
                sliceNameRU ||
                (editMode
                  ? 'RU ---' // this makes an empty title clickable
                  : '')
              }
              canEdit={editMode}
              emptyText=""
              onSaveTitle={updateSliceNameRU}
              showTooltip={false}
              // DODO-changed
              onClickTitle={
                process.env.type === undefined ? handleClickTitle : () => {}
              }
            />
          </Tooltip>
        )}

        {!!Object.values(annotationQuery).length && (
          <Tooltip
            id="annotations-loading-tooltip"
            placement="top"
            title={annotationsLoading}
          >
            <i
              role="img"
              aria-label={annotationsLoading}
              className="fa fa-refresh warning"
            />
          </Tooltip>
        )}
        {!!Object.values(annotationError).length && (
          <Tooltip
            id="annoation-errors-tooltip"
            placement="top"
            title={annotationsError}
          >
            <i
              role="img"
              aria-label={annotationsError}
              className="fa fa-exclamation-circle danger"
            />
          </Tooltip>
        )}
      </div>
      <div className="header-controls">
        {!editMode && (
          <>
            {crossFilterValue && (
              <Tooltip
                placement="top"
                title={
                  <FilterIndicator
                    indicator={indicator}
                    text={t('Click to clear emitted filters')}
                  />
                }
              >
                <CrossFilterIcon
                  onClick={() => dispatch(clearDataMask(slice?.slice_id))}
                />
              </Tooltip>
            )}
            {!uiConfig.hideChartControls && (
              <FiltersBadge chartId={slice.slice_id} />
            )}
            {!uiConfig.hideChartControls && (
              <SliceHeaderControls
                slice={slice}
                isCached={isCached}
                isExpanded={isExpanded}
                cachedDttm={cachedDttm}
                updatedDttm={updatedDttm}
                toggleExpandSlice={toggleExpandSlice}
                forceRefresh={forceRefresh}
                logExploreChart={logExploreChart}
                onExploreChart={onExploreChart}
                exportCSV={exportCSV}
                exportXLSX={exportXLSX}
                exportFullCSV={exportFullCSV}
                supersetCanExplore={supersetCanExplore}
                supersetCanShare={supersetCanShare}
                supersetCanCSV={supersetCanCSV}
                sliceCanEdit={sliceCanEdit}
                componentId={componentId}
                dashboardId={dashboardId}
                addSuccessToast={addSuccessToast}
                addDangerToast={addDangerToast}
                handleToggleFullSize={handleToggleFullSize}
                isFullSize={isFullSize}
                isDescriptionExpanded={isExpanded}
                chartStatus={chartStatus}
                formData={formData}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SliceHeader;
