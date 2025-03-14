from superset.stats_logger import BaseStatsLogger
from typing import Optional

try:
    from werkzeug.middleware.dispatcher import DispatcherMiddleware
    from prometheus_client import make_wsgi_app, Counter, Gauge, Summary

    class PrometheusStatsLogger(BaseStatsLogger):
        def __init__(self, prefix: str = "superset") -> None:
            super().__init__(prefix)

            # Define Prometheus metrics with dynamic labels
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
                labelnames=["user_id", "action", "dashboard_id", "slice_id"],
            )

            self._duration_summary = Summary(
                f"{self.prefix}_duration_summary",
                "Duration summary metric for Superset",
                labelnames=["dashboard_id", "slice_id", "user_id"],
            )

            # New gauge metric for tracking real-time unique user views
            self._real_time_unique_views = Gauge(
                f"{self.prefix}_real_time_unique_views",
                "Gauge metric for tracking real-time unique user views per dashboard",
                labelnames=["user_id", "dashboard_id"],
                multiprocess_mode="livesum",
            )

        def incr(self, key: str) -> None:
            self._counter.labels(key=key).inc()

        def user_activity(
            self, user_id: Optional[int], action: str, dashboard_id: Optional[int], slice_id: Optional[int]
        ) -> None:
            # Increment the user activity counter
            self._user_activity.labels(
                user_id=user_id,
                action=action,
                dashboard_id=dashboard_id,
                slice_id=slice_id
            ).inc()

            # Update the real-time unique views gauge if dashboard_id is not None
            if dashboard_id is not None:
                self._real_time_unique_views.labels(
                    user_id=user_id,
                    dashboard_id=dashboard_id
                ).set(1)  # Set the gauge value to 1 for the specific user and dashboard

        def duration(
            self, dashboard_id: Optional[int], slice_id: Optional[int], user_id: Optional[int], duration_ms: float
        ) -> None:
            self._duration_summary.labels(
                dashboard_id=dashboard_id,
                slice_id=slice_id,
                user_id=user_id
            ).observe(duration_ms / 1000.0)  # Convert milliseconds to seconds

        def decr(self, key: str) -> None:
            raise NotImplementedError("Decrement operation is not supported.")

        def timing(self, key: str, value: float) -> None:
            self._summary.labels(key=key).observe(value)

        def gauge(self, key: str, value: float) -> None:
            self._gauge.labels(key=key).set(value)

except Exception:  # pylint: disable=broad-except
    pass