/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { Dashboard, Datasource, EmbeddedDashboard } from 'src/dashboard/types';
import { Chart } from 'src/types/Chart';
import { useApiV1Resource, useTransformedResource } from './apiResources';

export const useDashboard = (idOrSlug: string | number) =>
  useTransformedResource(
    useApiV1Resource<Dashboard>(`/api/v1/dashboard/${idOrSlug}`),
    dashboard => ({
      ...dashboard,
      // TODO: load these at the API level
      metadata:
        (dashboard.json_metadata && JSON.parse(dashboard.json_metadata)) || {},
      position_data:
        dashboard.position_json && JSON.parse(dashboard.position_json),
      owners: dashboard.owners || [],
    }),
  );

// gets the chart definitions for a dashboard
// export const useDashboardCharts = (idOrSlug: string | number) =>
//   useApiV1Resource<Chart[]>(`/api/v1/dashboard/${idOrSlug}/charts`);
// DODO changed 44120742
export const useDashboardCharts = (
  idOrSlug: string | number,
  language?: string,
) =>
  useApiV1Resource<Chart[]>(
    !language
      ? `/api/v1/dashboard/${idOrSlug}/charts`
      : `/api/v1/dashboard/${idOrSlug}/charts?language=${language}`,
  );

// gets the datasets for a dashboard
// important: this endpoint only returns the fields in the dataset
// that are necessary for rendering the given dashboard
// export const useDashboardDatasets = (idOrSlug: string | number) =>
//   useApiV1Resource<Datasource[]>(`/api/v1/dashboard/${idOrSlug}/datasets`);
// DODO changed 44120742
export const useDashboardDatasets = (
  idOrSlug: string | number,
  language?: string,
) =>
  useApiV1Resource<Datasource[]>(
    !language
      ? `/api/v1/dashboard/${idOrSlug}/datasets`
      : `/api/v1/dashboard/${idOrSlug}/datasets?language=${language}`,
  );

export const useEmbeddedDashboard = (idOrSlug: string | number) =>
  useApiV1Resource<EmbeddedDashboard>(`/api/v1/dashboard/${idOrSlug}/embedded`);
