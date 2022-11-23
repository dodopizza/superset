// DODO-changed
import {
  CHART_TYPE,
  MARKDOWN_TYPE,
  COLUMN_TYPE,
  DIVIDER_TYPE,
  HEADER_TYPE,
  ROW_TYPE,
  TAB_TYPE,
  TABS_TYPE,
} from '../../util/componentTypes';

import ChartHolder from 'src/dashboard/components/gridComponents/ChartHolder';
import ChartHolderPlugin from 'src/Superstructure/dashboard/components/gridComponents/ChartHolder';

import Markdown from './Markdown';
import Column from './Column';
import Divider from './Divider';
import Header from './Header';
import Row from './Row';
import Tab from './Tab';
import TabsConnected from './Tabs';

console.log('gridComponents process.env.business', process.env.business);

export { default as ChartHolderPlugin } from 'src/Superstructure/dashboard/components/gridComponents/ChartHolder';
export { default as ChartHolder } from 'src/dashboard/components/gridComponents/ChartHolder';

export { default as Markdown } from './Markdown';
export { default as Column } from './Column';
export { default as Divider } from './Divider';
export { default as Header } from './Header';
export { default as Row } from './Row';
export { default as Tab } from './Tab';
export { default as Tabs } from './Tabs';

export const componentLookup = {
  [CHART_TYPE]: !process.env.business ? ChartHolder : ChartHolderPlugin,
  [MARKDOWN_TYPE]: Markdown,
  [COLUMN_TYPE]: Column,
  [DIVIDER_TYPE]: Divider,
  [HEADER_TYPE]: Header,
  [ROW_TYPE]: Row,
  [TAB_TYPE]: Tab,
  [TABS_TYPE]: TabsConnected,
};
