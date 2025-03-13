from superset.stats_logger import BaseStatsLogger
from typing import Optional, Dict

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
                labelnames=["key", "is_plugin"],  # Add `is_plugin` as a label
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

        def incr(self, key: str, labels: Optional[Dict[str, str]] = None) -> None:
            """
            Increment a Prometheus counter with optional labels.
            :param key: The metric key (e.g., "dashboard_123").
            :param labels: A dictionary of additional labels (e.g., {"is_plugin": "True"}).
            """
            # Start with the base label
            label_values = {"key": key}

            # Add only the labels that match the defined labelnames
            if labels:
                for label_name in self._counter._labelnames:  # Use the defined labelnames
                    if label_name in labels:
                        label_values[label_name] = labels[label_name]

            # Increment the counter with the combined labels
            self._counter.labels(**label_values).inc()

        def user_activity(
            self, user_id: Optional[int], action: str, dashboard_id: Optional[int]
        ) -> None:
            self._user_activity.labels(
                user_id=user_id, action=action, dashboard_id=dashboard_id
            ).inc()

        def decr(self, key: str) -> None:
            raise NotImplementedError("Decrement operation is not supported.")

        def timing(self, key: str, value: float) -> None:
            self._summary.labels(key=key).observe(value)

        def gauge(self, key: str, value: float) -> None:
            self._gauge.labels(key=key).set(value)

except Exception:  # pylint: disable=broad-except
    pass