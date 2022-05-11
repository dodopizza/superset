# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.
from typing import Optional
from superset.stats_logger import BaseStatsLogger

try:
    from prometheus_client import Counter, Gauge, Summary

    class PrometheusStatsLogger(BaseStatsLogger):
        def __init__(self, prefix: str = "superset") -> None:
            super().__init__(prefix)

            self._counter = Counter(
                f"{self.prefix}_counter",
                "Counter metric for Superset",
                labelnames=["key"],
            )

            self._gauge = Gauge(
                f"{self.prefix}_gauge",
                "Gauge metric for Superset",
                labelnames=["key"],
                multiprocess_mode="livesum",
            )

            self._summary = Summary(
                f"{self.prefix}_summary",
                "Summary metric for Superset",
                labelnames=["key"],
            )

            self._user_activity = Counter(
                f"{self.prefix}_user_activity",
                "User activity counter",
                labelnames=["user_id", "action", "dashboard_id"],
            )

        def incr(self, key: str) -> None:
            self._counter.labels(key=key).inc()

        def user_activity(
            self, user_id: Optional[int], action: str, dashboard_id: Optional[int]
        ) -> None:
            self._user_activity.labels(
                user_id=user_id, action=action, dashboard_id=dashboard_id
            ).inc()

        def decr(self, key: str) -> None:
            raise NotImplementedError()

        def timing(self, key: str, value: float) -> None:
            self._summary.labels(key=key).observe(value)

        def gauge(self, key: str, value: float) -> None:
            self._gauge.labels(key=key).set(value)

except Exception:  # pylint: disable=broad-except
    pass
