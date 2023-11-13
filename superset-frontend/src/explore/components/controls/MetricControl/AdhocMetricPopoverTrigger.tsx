// DODO was here
// labelRU

import React, { ReactNode } from 'react';
import { Datasource, Metric } from '@superset-ui/core';
import AdhocMetricEditPopoverTitle from 'src/explore/components/controls/MetricControl/AdhocMetricEditPopoverTitle';
import { ExplorePopoverContent } from 'src/explore/components/ExploreContentPopover';
import AdhocMetricEditPopover, {
  SAVED_TAB_KEY,
} from './AdhocMetricEditPopover';
import AdhocMetric from './AdhocMetric';
import { savedMetricType } from './types';
import ControlPopover from '../ControlPopover/ControlPopover';

export type AdhocMetricPopoverTriggerProps = {
  adhocMetric: AdhocMetric;
  onMetricEdit(newMetric: Metric, oldMetric: Metric): void;
  columns: { column_name: string; type: string }[];
  savedMetricsOptions: savedMetricType[];
  savedMetric: savedMetricType;
  datasource?: Datasource;
  children: ReactNode;
  isControlledComponent?: boolean;
  visible?: boolean;
  togglePopover?: (visible: boolean) => void;
  closePopover?: () => void;
};

export type AdhocMetricPopoverTriggerState = {
  adhocMetric: AdhocMetric;
  popoverVisible: boolean;
  title: { label: string; labelRU: string; hasCustomLabel: boolean };
  currentLabel: string;
  currentLabelRU: string;
  labelModified: boolean;
  // labelRUModified: boolean;
  isTitleEditDisabled: boolean;
};

class AdhocMetricPopoverTrigger extends React.PureComponent<
  AdhocMetricPopoverTriggerProps,
  AdhocMetricPopoverTriggerState
> {
  constructor(props: AdhocMetricPopoverTriggerProps) {
    super(props);
    this.onPopoverResize = this.onPopoverResize.bind(this);
    this.onLabelChange = this.onLabelChange.bind(this);
    this.onLabelRUChange = this.onLabelRUChange.bind(this);
    this.closePopover = this.closePopover.bind(this);
    this.togglePopover = this.togglePopover.bind(this);
    this.getCurrentTab = this.getCurrentTab.bind(this);
    this.getCurrentLabel = this.getCurrentLabel.bind(this);
    this.onChange = this.onChange.bind(this);

    this.state = {
      adhocMetric: props.adhocMetric,
      popoverVisible: false,
      title: {
        label: props.adhocMetric.label,
        labelRU: props.adhocMetric.labelRU,
        hasCustomLabel: props.adhocMetric.hasCustomLabel,
      },
      currentLabel: '',
      currentLabelRU: '',
      labelModified: false,
      // labelRUModified: false,
      isTitleEditDisabled: false,
    };
  }

  static getDerivedStateFromProps(
    nextProps: AdhocMetricPopoverTriggerProps,
    prevState: AdhocMetricPopoverTriggerState,
  ) {
    if (prevState.adhocMetric.optionName !== nextProps.adhocMetric.optionName) {
      return {
        adhocMetric: nextProps.adhocMetric,
        title: {
          label: nextProps.adhocMetric.label,
          labelRU: nextProps.adhocMetric.labelRU,
          hasCustomLabel: nextProps.adhocMetric.hasCustomLabel,
        },
        currentLabel: '',
        labelModified: false,
      };
    }
    return {
      adhocMetric: nextProps.adhocMetric,
    };
  }

  onLabelChange(e: any) {
    const { verbose_name, metric_name } = this.props.savedMetric;
    const defaultMetricLabel = this.props.adhocMetric?.getDefaultLabel();
    const label = e.target.value;
    this.setState(state => ({
      title: {
        label:
          label ||
          state.currentLabel ||
          verbose_name ||
          metric_name ||
          defaultMetricLabel,
        hasCustomLabel: !!label,
        labelRU: state.title.labelRU,
      },
      labelModified: true,
    }));
  }

  onLabelRUChange(e: any) {
    const { verbose_name, metric_name } = this.props.savedMetric;
    const defaultMetricLabel = this.props.adhocMetric?.getDefaultLabelRU();
    const label = e.target.value;
    this.setState(state => ({
      title: {
        labelRU:
          label ||
          state.currentLabelRU ||
          verbose_name ||
          metric_name ||
          defaultMetricLabel,
        hasCustomLabel: !!label,
        label: state.title.label,
      },
      // labelRUModified: true,
    }));
  }

  onPopoverResize() {
    this.forceUpdate();
  }

  closePopover() {
    this.togglePopover(false);
    this.setState({
      labelModified: false,
      // labelModifiedRU: false,
    });
  }

  togglePopover(visible: boolean) {
    this.setState({
      popoverVisible: visible,
    });
  }

  getCurrentTab(tab: string) {
    this.setState({
      isTitleEditDisabled: tab === SAVED_TAB_KEY,
    });
  }

  getCurrentLabel({
    savedMetricLabel,
    adhocMetricLabel,
    adhocMetricLabelRU,
  }: {
    savedMetricLabel: string;
    adhocMetricLabel: string;
    adhocMetricLabelRU: string;
  }) {
    console.log('savedMetricLabel', savedMetricLabel);
    console.log('adhocMetricLabel', adhocMetricLabel);
    console.log('adhocMetricLabelRU', adhocMetricLabelRU);
    const currentLabel = savedMetricLabel || adhocMetricLabel;
    const currentLabelRU = savedMetricLabel || adhocMetricLabelRU;

    this.setState({
      currentLabel,
      currentLabelRU,
      labelModified: true,
    });
    if (savedMetricLabel || !this.state.title.hasCustomLabel) {
      this.setState({
        title: {
          label: currentLabel,
          labelRU: currentLabelRU,
          hasCustomLabel: false,
        },
      });
    }
  }

  onChange(newMetric: Metric, oldMetric: Metric) {
    this.props.onMetricEdit({ ...newMetric, ...this.state.title }, oldMetric);
  }

  render() {
    const {
      adhocMetric,
      savedMetric,
      columns,
      savedMetricsOptions,
      datasource,
      isControlledComponent,
    } = this.props;
    const { verbose_name, metric_name } = savedMetric;
    const { hasCustomLabel, label, labelRU } = adhocMetric;

    const adhocMetricLabel = hasCustomLabel
      ? label
      : adhocMetric.getDefaultLabel();

    const adhocMetricLabelRU = hasCustomLabel
      ? labelRU
      : adhocMetric.getDefaultLabelRU();

    const title = this.state.labelModified
      ? this.state.title
      : {
          label: verbose_name || metric_name || adhocMetricLabel,
          labelRU: verbose_name || metric_name || adhocMetricLabelRU,
          hasCustomLabel,
        };

    const { visible, togglePopover, closePopover } = isControlledComponent
      ? {
          visible: this.props.visible,
          togglePopover: this.props.togglePopover,
          closePopover: this.props.closePopover,
        }
      : {
          visible: this.state.popoverVisible,
          togglePopover: this.togglePopover,
          closePopover: this.closePopover,
        };

    const overlayContent = (
      <ExplorePopoverContent>
        <AdhocMetricEditPopover
          adhocMetric={adhocMetric}
          columns={columns}
          savedMetricsOptions={savedMetricsOptions}
          savedMetric={savedMetric}
          datasource={datasource}
          onResize={this.onPopoverResize}
          onClose={closePopover}
          onChange={this.onChange}
          getCurrentTab={this.getCurrentTab}
          getCurrentLabel={this.getCurrentLabel}
        />
      </ExplorePopoverContent>
    );

    const popoverTitle = (
      <AdhocMetricEditPopoverTitle
        title={title}
        onChange={this.onLabelChange}
        onChangeRU={this.onLabelRUChange}
        isEditDisabled={this.state.isTitleEditDisabled}
      />
    );

    return (
      <ControlPopover
        placement="right"
        trigger="click"
        content={overlayContent}
        defaultVisible={visible}
        visible={visible}
        onVisibleChange={togglePopover}
        title={popoverTitle}
        destroyTooltipOnHide
      >
        {this.props.children}
      </ControlPopover>
    );
  }
}

export default AdhocMetricPopoverTrigger;
