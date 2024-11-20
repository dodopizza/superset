/*
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

import prettyMsFormatter from 'pretty-ms';
import NumberFormatter from '../NumberFormatter';
// DODO added 33638561
import { NumberFormatFunction } from '../types';

export default function createDurationFormatter(
  config: {
    description?: string;
    id?: string;
    label?: string;
    multiplier?: number;
    // DODO added 33638561
    formatFunc?: NumberFormatFunction;
  } & prettyMsFormatter.Options = {},
) {
  // DODO chaned start 33638561
  const {
    description,
    id,
    label,
    multiplier = 1,
    formatFunc,
    ...prettyMsOptions
  } = config;
  // DODO added stop 33638561

  return new NumberFormatter({
    description,
    // DODO changed start 33638561
    formatFunc:
      formatFunc ??
      (value => prettyMsFormatter(value * multiplier, prettyMsOptions)),
    // DODO changed stop 33638561
    id: id ?? 'duration_format',
    label: label ?? `Duration formatter`,
  });
}
