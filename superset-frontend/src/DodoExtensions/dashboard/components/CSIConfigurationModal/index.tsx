import { useState, useRef, lazy, Suspense } from 'react';
import { styled, t } from '@superset-ui/core';
import { useToasts } from 'src/components/MessageToasts/withToasts';
import ModalTrigger, { ModalTriggerRef } from 'src/components/ModalTrigger';
import Button from 'src/components/Button';
import { bootstrapData } from 'src/preamble';
import Tabs from 'src/components/Tabs/Tabs';
import Checkbox from 'src/components/Checkbox';
import Loading from 'src/components/Loading';
import Table, { TableSize } from 'src/components/Table';
import { Radio } from 'src/components/Radio';
import { Select } from 'src/components';
import {
  areArraysEqual,
  mockedFeedbackData,
  getChartOptions,
  getTableColumns,
  Feedback,
  Granularity,
} from './utils';

const EchartLazy = lazy(
  () => import('src/../plugins/plugin-chart-echarts/src/components/Echart'),
);

const locale = bootstrapData?.common?.locale || 'en';

const TabPane = styled(Tabs.TabPane)`
  padding: ${({ theme }) => theme.gridUnit * 4}px 0px;
`;

const StyledSelect = styled(Select)`
  width: 110px;
`;

const Label = styled.p`
  margin: 0;
  text-wrap: nowrap;
`;

const ChartContainer = styled.div`
  margin-top: ${({ theme }) => theme.gridUnit * 4}px;
  min-height: 200px;
`;

const FlexRow = styled.div<{ gapUnits?: number; justify?: string }>`
  display: flex;
  justify-content: ${({ justify }) => justify || 'space-between'};
  align-items: center;
  gap: ${({ gapUnits = 4, theme }) => theme.gridUnit * gapUnits}px;
`;

const ConfigurationWrapper = styled(FlexRow)`
  min-height: 32px;
`;

enum Env {
  Standalone = 'standalone',
  Plugin = 'plugin',
}

type Tab = 'configuration' | 'collection';

interface CSIData {
  envs: Env[];
  data: Feedback[];
}

const CSIConfigurationModal = ({
  dashboardId,
  dashboardTitle,
  dashboardTitleRU,
}: {
  dashboardId: number;
  dashboardTitle: string;
  dashboardTitleRU: string;
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('configuration');
  const modalRef = useRef<ModalTriggerRef['current']>(null);
  const { addDangerToast, addSuccessToast } = useToasts();

  // configuration states
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [newEnvs, setNewEnvs] = useState<Env[]>([]);

  // charts states
  const [csiData, setCsiData] = useState<CSIData | null>(null);
  const [isTableViz, setIsTableViz] = useState(true);
  const [isStacked, setIsStacked] = useState(true);
  const [granularity, setGranularity] = useState<Granularity>('month');

  const localisedDashboardTitle =
    locale === 'ru' ? dashboardTitleRU : dashboardTitle;

  const handleClose = () => {
    modalRef.current?.close();
  };

  const handleChangeTab = (key: Tab) => {
    setActiveTab(key);
  };

  const handleEnvChange = (env: Env) => (checked: boolean) => {
    if (checked) {
      setNewEnvs(prev => [...prev, env]);
    } else {
      setNewEnvs(prev => prev.filter(e => e !== env));
    }
  };

  const getDashboardCSI = async () => {
    setIsLoading(true);
    try {
      // const resp = await SupersetClient.get({
      //   endpoint: `/api/v1/dashboard/${dashboardId}`,
      // });

      await new Promise(resolve => {
        setTimeout(resolve, 1000);
      });

      setCsiData({ envs: [], data: mockedFeedbackData });
    } catch {
      addDangerToast('Failed to fetch CSI info');
    } finally {
      setIsLoading(false);
    }
  };

  const applyConfiguration = async () => {
    try {
      setIsApplying(true);
      // await SupersetClient.put({
      //   endpoint: `/api/v1/dashboard/${dashboardId}`,
      //   jsonPayload: {
      //     is_csi_enabled: true,
      //   },
      // });
      await new Promise(resolve => {
        setTimeout(resolve, 2000);
      });

      addSuccessToast(
        t('CSI is enabled for dashboard %s', localisedDashboardTitle),
      );

      handleClose();
    } catch (error) {
      addDangerToast(
        t(
          'An error occurred while enabling CSI for dashboard %s. Please try again.',
          localisedDashboardTitle,
        ),
      );
    } finally {
      setIsApplying(false);
    }
  };

  const body = (
    <>
      {isLoading && <Loading />}
      {csiData && (
        <Tabs activeKey={activeTab} onChange={handleChangeTab}>
          <TabPane key="configuration" tab={t('Configuration')}>
            <>
              <p>{t('Set up feedback collection for:')}</p>
              <FlexRow justify="flex-start" gapUnits={2}>
                <Checkbox
                  checked={newEnvs.includes(Env.Standalone)}
                  onChange={handleEnvChange(Env.Standalone)}
                />
                <Label>Standalone</Label>
              </FlexRow>
              <FlexRow justify="flex-start" gapUnits={2}>
                <Checkbox
                  checked={newEnvs.includes(Env.Plugin)}
                  onChange={handleEnvChange(Env.Plugin)}
                />
                <Label>Office Manager</Label>
              </FlexRow>
            </>
          </TabPane>

          <TabPane key="collection" tab={t('Data collection')}>
            <ConfigurationWrapper>
              <FlexRow>
                <Radio.Group
                  value={isTableViz ? 'table' : 'chart'}
                  onChange={e => setIsTableViz(e.target.value === 'table')}
                >
                  <Radio value="table">{t('Table')}</Radio>
                  <Radio value="chart">{t('Chart')}</Radio>
                </Radio.Group>
              </FlexRow>

              {!isTableViz && (
                <FlexRow gapUnits={5}>
                  <FlexRow gapUnits={2}>
                    <Checkbox
                      checked={isStacked}
                      onChange={val => setIsStacked(Boolean(val))}
                    />
                    <Label>{t('Stacked')}</Label>
                  </FlexRow>
                  <StyledSelect
                    value={granularity}
                    onChange={val => setGranularity(val as Granularity)}
                    options={[
                      { label: t('Day'), value: 'day' },
                      { label: t('Week'), value: 'week' },
                      { label: t('Month'), value: 'month' },
                    ]}
                  />
                </FlexRow>
              )}
            </ConfigurationWrapper>

            <ChartContainer>
              <Suspense fallback={<Loading />}>
                {isTableViz ? (
                  <Table
                    data={csiData.data}
                    columns={getTableColumns()}
                    size={TableSize.Small}
                    usePagination
                    defaultPageSize={10}
                  />
                ) : (
                  <EchartLazy
                    {...getChartOptions(csiData.data, granularity, isStacked)}
                  />
                )}
              </Suspense>
            </ChartContainer>
          </TabPane>
        </Tabs>
      )}
    </>
  );

  return (
    <ModalTrigger
      ref={modalRef}
      triggerNode={<span>{t('Dashboard CSI')}</span>}
      modalTitle={t('Dashboard CSI')}
      width="700px"
      beforeOpen={getDashboardCSI}
      onExit={() => {
        setActiveTab('configuration');
        setIsLoading(false);
        setIsApplying(false);
        setCsiData(null);
        setIsTableViz(true);
        setNewEnvs([]);
      }}
      modalBody={body}
      modalFooter={
        <>
          {activeTab === 'configuration' && (
            <Button
              buttonStyle="primary"
              buttonSize="small"
              onClick={applyConfiguration}
              disabled={
                isApplying || areArraysEqual(csiData?.envs || [], newEnvs)
              }
              loading={isApplying}
            >
              {t('Apply')}
            </Button>
          )}
          <Button
            onClick={handleClose}
            buttonSize="small"
            disabled={isApplying}
          >
            {t('Close')}
          </Button>
        </>
      }
    />
  );
};

export default CSIConfigurationModal;
