from superset.stats_logger import BaseStatsLogger
from typing import Optional, Dict, Tuple
from prometheus_client import Counter, Gauge, Histogram
import threading
from datetime import datetime, timedelta


class PrometheusStatsLogger(BaseStatsLogger):
    """
    A Prometheus-based stats logger for Superset, tracking user activity, dashboard load times,
    and system performance metrics.
    """

    def __init__(self, prefix: str = "superset") -> None:
        """
        Initialize Prometheus metrics for Superset monitoring.

        Args:
            prefix (str): Prefix for all Prometheus metric names (default: "superset").
        """
        super().__init__(prefix)

        # User activity counter
        self._user_activity = Counter(
            f"{self.prefix}_user_activity",
            "Counter for user actions in Superset",
            labelnames=["user_id", "action", "dashboard_id", "slice_id", "is_plugin"],
        )

        # Dashboard and slice load duration histogram
        self._dashboard_load_duration = Histogram(
            f"{self.prefix}_dashboard_load_duration",
            "Histogram of dashboard and slice load times in milliseconds",
            labelnames=["dashboard_id", "slice_id", "user_id"],
            buckets=[5000, 15000, 30000, 45000, 60000, 90000, 120000, 150000, 180000],  # Custom buckets
        )

        # Real-time unique views gauge
        self._real_time_unique_views = Gauge(
            f"{self.prefix}_real_time_unique_views",
            "Number of real-time unique user views per dashboard",
            labelnames=["user_id", "dashboard_id"],
            multiprocess_mode="livesum",
        )

        # Cache hit/miss counter
        self._cache_requests = Counter(
            f"{self.prefix}_cache_requests",
            "Counter for cache hits and misses",
            labelnames=["cache_type", "status"],  # e.g., cache_type: "redis", status: "hit" or "miss"
        )

        # Celery task duration histogram (if Celery is used)
        self._celery_task_duration = Histogram(
            f"{self.prefix}_celery_task_duration",
            "Histogram of Celery task execution times in milliseconds",
            labelnames=["task_name", "status"],  # e.g., task_name: "execute_query", status: "success"
            buckets=[100, 500, 1000, 5000, 10000, 30000],  # Tuned for async tasks
        )

        # Query error counter
        self._query_errors = Counter(
            f"{self.prefix}_query_errors",
            "Counter for query execution errors",
            labelnames=["dashboard_id", "slice_id", "error_type"],  # e.g., error_type: "timeout"
        )

        # Track active views with timestamps for cleanup
        self._active_views: Dict[Tuple[str, str], datetime] = {}

        # Start the periodic cleanup job
        self._start_cleanup_job()

    def _start_cleanup_job(self) -> None:
        """
        Start a periodic cleanup job to decrement the gauge for stale views.
        """
        def cleanup_stale_views():
            cutoff_time = datetime.now() - timedelta(minutes=5)  # Stale if older than 5 minutes
            stale_views = [
                (user_id, dashboard_id)
                for (user_id, dashboard_id), timestamp in self._active_views.items()
                if timestamp < cutoff_time
            ]

            for user_id, dashboard_id in stale_views:
                self.stop_view(user_id=int(user_id), dashboard_id=int(dashboard_id))
                del self._active_views[(user_id, dashboard_id)]  # Remove from active views

            # Schedule the next cleanup
            threading.Timer(60, cleanup_stale_views).start()  # Run every 60 seconds

        # Start the first cleanup job
        threading.Timer(60, cleanup_stale_views).start()

    def incr(self, key: str) -> None:
        """
        Increment a generic counter (kept for compatibility, but prefer specific methods).

        Args:
            key (str): The metric key to increment.
        """
        self._user_activity.labels(
            user_id="anonymous", action=key, dashboard_id="none", slice_id="none", is_plugin=None
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
            user_id=str(user_id) if user_id is not None else "anonymous",
            action=action,
            dashboard_id=str(dashboard_id) if dashboard_id is not None else "none",
            slice_id=str(slice_id) if slice_id is not None else "none",
            is_plugin=str(is_plugin) if is_plugin is not None else "none",
        ).inc()

        # Update real-time unique views if dashboard_id is provided
        if dashboard_id is not None and user_id is not None:
            self.start_view(user_id=user_id, dashboard_id=dashboard_id)

    def start_view(self, user_id: int, dashboard_id: int) -> None:
        """
        Start tracking a user's view of a dashboard.

        Args:
            user_id (int): The ID of the user viewing the dashboard.
            dashboard_id (int): The ID of the dashboard being viewed.
        """
        self._real_time_unique_views.labels(
            user_id=str(user_id),
            dashboard_id=str(dashboard_id),
        ).inc()  # Increment the gauge to indicate an active view

        # Record the start time of the view
        self._active_views[(str(user_id), str(dashboard_id))] = datetime.now()

    def stop_view(self, user_id: int, dashboard_id: int) -> None:
        """
        Stop tracking a user's view of a dashboard.

        Args:
            user_id (int): The ID of the user who stopped viewing the dashboard.
            dashboard_id (int): The ID of the dashboard being viewed.
        """
        self._real_time_unique_views.labels(
            user_id=str(user_id),
            dashboard_id=str(dashboard_id),
        ).dec()  # Decrement the gauge to indicate the view has ended

        # Remove the view from active views
        self._active_views.pop((str(user_id), str(dashboard_id)), None)

    def duration(
        self,
        dashboard_id: Optional[int],
        slice_id: Optional[int],
        user_id: Optional[int],
        duration_ms: float,
    ) -> None:
        """
        Record the duration of dashboard or slice loading.

        Args:
            dashboard_id (Optional[int]): ID of the dashboard.
            slice_id (Optional[int]): ID of the slice/chart.
            user_id (Optional[int]): ID of the user.
            duration_ms (float): Duration in milliseconds.
        """
        self._dashboard_load_duration.labels(
            dashboard_id=str(dashboard_id) if dashboard_id is not None else "none",
            slice_id=str(slice_id) if slice_id is not None else "none",
            user_id=str(user_id) if user_id is not None else "anonymous",
        ).observe(duration_ms)

    def log_cache_request(self, cache_type: str, status: str) -> None:
        """
        Log cache request outcomes (hit or miss).

        Args:
            cache_type (str): Type of cache (e.g., "redis", "filesystem").
            status (str): Cache request outcome ("hit" or "miss").
        """
        self._cache_requests.labels(cache_type=cache_type, status=status).inc()

    def log_celery_task(
        self,
        task_name: str,
        duration_ms: float,
        status: str = "success",
    ) -> None:
        """
        Log the duration and status of a Celery task.

        Args:
            task_name (str): Name of the Celery task (e.g., "execute_query").
            duration_ms (float): Duration in milliseconds.
            status (str): Task status ("success" or "failure").
        """
        self._celery_task_duration.labels(
            task_name=task_name,
            status=status,
        ).observe(duration_ms)

    def log_query_error(
        self,
        dashboard_id: Optional[int],
        slice_id: Optional[int],
        error_type: str,
    ) -> None:
        """
        Log a query execution error.

        Args:
            dashboard_id (Optional[int]): ID of the dashboard.
            slice_id (Optional[int]): ID of the slice/chart.
            error_type (str): Type of error (e.g., "timeout", "syntax").
        """
        self._query_errors.labels(
            dashboard_id=str(dashboard_id) if dashboard_id is not None else "none",
            slice_id=str(slice_id) if slice_id is not None else "none",
            error_type=error_type,
        ).inc()

    def decr(self, key: str) -> None:
        """
        Decrement operation (not implemented, as it's rarely needed for Superset metrics).

        Args:
            key (str): The metric key to decrement.

        Raises:
            NotImplementedError: Decrement is not supported.
        """
        raise NotImplementedError("Decrement operation is not supported.")

    def timing(self, key: str, value: float) -> None:
        """
        Log timing data (kept for compatibility, but prefer specific methods).

        Args:
            key (str): The timing metric key.
            value (float): Duration in seconds (converted to ms internally).
        """
        self._dashboard_load_duration.labels(
            dashboard_id="none",
            slice_id="none",
            user_id="anonymous",
        ).observe(value * 1000)  # Convert seconds to milliseconds

    def gauge(self, key: str, value: float) -> None:
        """
        Set a gauge value (kept for compatibility, but prefer specific methods).

        Args:
            key (str): The gauge metric key.
            value (float): The value to set.
        """
        self._real_time_unique_views.labels(
            user_id="anonymous",
            dashboard_id=key,
        ).set(value)