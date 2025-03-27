from superset.stats_logger import BaseStatsLogger
from typing import Optional

try:
    from prometheus_client import make_wsgi_app, Counter, Gauge, Summary, Histogram

    # Define reusable buckets
    BUCKETS = [5000, 15000, 30000, 45000, 60000, 90000, 120000, 150000, 180000]

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
                f"Summary metric for Superset",
                labelnames=["key"],
            )

            self._dashboard_load_duration_milliseconds = Histogram(
                f"{self.prefix}_dashboard_load_duration_milliseconds",
                "Histogram of dashboard load durations in milliseconds",
                labelnames=["dashboard_id", "is_plugin"],
                buckets=BUCKETS,  # Align with prometheus.py
            )

            # New user registration counter
            self._new_user_registrations = Counter(
                f"{self.prefix}_new_user_registrations",
                "Tracks the number of new user registrations.",
                labelnames=["user_id"],
            )

        def incr(self, key: str) -> None:
            self._counter.labels(key=key).inc()

        def duration(
            self,
            dashboard_id: Optional[int],
            duration_ms: int,
            is_plugin: Optional[bool] = None
        ) -> None:
            self._dashboard_load_duration_milliseconds.labels(
                dashboard_id=str(dashboard_id) if dashboard_id is not None else "none",
                is_plugin=str(is_plugin) if is_plugin is not None else "none",
            ).observe(duration_ms)

        def timing(self, key: str, value: float) -> None:
            self._summary.labels(key=key).observe(value)

        def gauge(self, key: str, value: float) -> None:
            self._gauge.labels(key=key).set(value)

        # Used in dodo.py
        def incr_new_user_registration(self, user_id: str) -> None:
            self._new_user_registrations.labels(user_id=user_id).inc()

except Exception:  # pylint: disable=broad-except
    pass