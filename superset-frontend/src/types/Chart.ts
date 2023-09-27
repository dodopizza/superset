// DODO was here
// slice_name_second_lang

/**
 * The Chart model as returned from the API
 */

import { QueryFormData } from '@superset-ui/core';
import Owner from './Owner';

export interface Chart {
  id: number;
  url: string;
  viz_type: string;
  slice_name: string;
  slice_name_second_lang?: string;
  creator: string;
  changed_on: string;
  changed_on_delta_humanized?: string;
  changed_on_utc?: string;
  certified_by?: string;
  certification_details?: string;
  description: string | null;
  cache_timeout: number | null;
  thumbnail_url?: string;
  owners?: Owner[];
  datasource_name_text?: string;
  form_data: {
    viz_type: string;
  };
  is_managed_externally: boolean;
}

export type Slice = {
  id?: number;
  slice_id: number;
  slice_name: string;
  slice_name_second_lang?: string;
  description: string | null;
  cache_timeout: number | null;
  certified_by?: string;
  certification_details?: string;
  form_data?: QueryFormData;
  query_context?: object;
  is_managed_externally: boolean;
};

export default Chart;
