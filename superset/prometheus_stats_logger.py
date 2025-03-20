from superset.stats_logger import BaseStatsLogger
from typing import Optional
from prometheus_client import Counter, Gauge, Summary, Histogram

try:
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

            # User activity counter
            self._user_activity = Counter(
                f"{self.prefix}_user_activity",
                "Counter for user actions in Superset",
                labelnames=["user_id", "action", "dashboard_id", "slice_id", "is_plugin"],
            )

            self._query_errors = Counter(
                f"{self.prefix}_query_errors",
                "Counter for query errors",
                labelnames=["method", "endpoint", "status", "error_type"],
            )

            self._dashboard_load_duration = Histogram(
                f"{self.prefix}_dashboard_load_duration",
                "Histogram of dashboard load durations in milliseconds",
                labelnames=["dashboard_id", "slice_id", "user_id"],
                buckets=[5000, 15000, 30000, 45000, 60000, 90000, 120000, 150000, 180000],  # Align with prometheus.py
            )

            # New user registration counter
            self._new_user_registrations = Counter(
                f"{self.prefix}_new_user_registrations",
                "Tracks the number of new user registrations.",
                labelnames=["user_id", "email"],
            )

        def incr(
            self,
            key: str,
            user_id: str = "unknown",
            dashboard_id: Optional[str] = None,
            slice_id: Optional[str] = None,
            is_plugin: Optional[bool] = None
        ) -> None:
            self._counter.labels(key=key).inc()
            self._user_activity.labels(
                user_id=user_id,
                action=key,
                dashboard_id=dashboard_id or "none",
                slice_id=slice_id or "none",
                is_plugin=str(is_plugin) if is_plugin is not None else "none",
            ).inc()

        def duration(self, dashboard_id: Optional[int], slice_id: Optional[int], user_id: str, duration_ms: int) -> None:
            """
            Log the duration of an action.
            Args:
                dashboard_id (Optional[int]): ID of the dashboard involved.
                slice_id (Optional[int]): ID of the slice/chart involved.
                user_id (str): The username of the user performing the action.
                duration_ms (int): Duration of the action in milliseconds.
            """
            self._dashboard_load_duration.labels(
                dashboard_id=str(dashboard_id) if dashboard_id is not None else "none",
                slice_id=str(slice_id) if slice_id is not None else "none",
                user_id=user_id,
            ).observe(duration_ms)

        # Used in GunicornPrometheusLogger
        def log_query_error(
            self,
            error_type: str,
            method: str = "UNKNOWN",
            endpoint: str = "/unknown",
            status: int = None,
            duration_in_ms: float = None
        ) -> None:
            """
            Log query errors using the _query_errors counter.

            Args:
                error_type (str): Type of error (e.g., "client_error", "server_error").
                method (str): HTTP method (e.g., "GET", "POST").
                endpoint (str): Requested endpoint (e.g., "/api/data").
                status (int): HTTP status code (e.g., 404, 500).
                duration_in_ms (float): Duration of the request in milliseconds.
            """
            self._query_errors.labels(
                method=method,
                endpoint=endpoint,
                status=str(status),
                error_type=error_type,
            ).inc()

        def user_activity(
            self,
            user_id: Optional[int],
            action: str,
            dashboard_id: Optional[int] = None,
            slice_id: Optional[int] = None,
            is_plugin: Optional[bool] = None,
        ) -> None:
            """
            Log user activity in Superset.
            Args:
                user_id (Optional[int]): ID of the user performing the action.
                action (str): Type of action (e.g., "view_dashboard", "edit_slice").
                dashboard_id (Optional[int]): ID of the dashboard involved.
                slice_id (Optional[int]): ID of the slice/chart involved.
                is_plugin (Optional[bool]): Whether the action was performed via a plugin.
            """
            self._user_activity.labels(
                user_id=str(user_id) if user_id is not None else "unknown",
                action=action,
                dashboard_id=str(dashboard_id) if dashboard_id is not None else "none",
                slice_id=str(slice_id) if slice_id is not None else "none",
                is_plugin=str(is_plugin) if is_plugin is not None else "none",
            ).inc()

        def timing(self, key: str, value: float) -> None:
            self._summary.labels(key=key).observe(value)

        def gauge(self, key: str, value: float) -> None:
            self._gauge.labels(key=key).set(value)

        # Used in dodo.py
        def incr_new_user_registration(
            self,
            user_id: str,
            email: str,
        ) -> None:
            """
            Increment the new user registration counter.

            Args:
                user_id (str): The ID of the newly registered user.
                email (str): The email of the newly registered user.
            """
            try:
                self._new_user_registrations.labels(
                    user_id=user_id,
                    email=email,
                ).inc()
            except Exception as e:
                logger.error(f"[prometheus_stats_logger.py] Failed to log new user registration metric: {e}")

except Exception:  # pylint: disable=broad-except
    pass