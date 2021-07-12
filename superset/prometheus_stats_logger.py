from superset.stats_logger import BaseStatsLogger

try:
    from werkzeug.middleware.dispatcher import DispatcherMiddleware
    from prometheus_client import make_wsgi_app, Counter, Gauge, Summary


    class PrometheusStatsLogger(BaseStatsLogger):
        def __init__(self, prefix: str = "superset") -> None:
            super().__init__(prefix)

            self._counter = Counter(f"{self.prefix}_counter",
                                    "Counter metric for Superset", labelnames=["key"])

            self._gauge = Gauge(f"{self.prefix}_gauge", "Gauge metric for Superset",
                                labelnames=["key"], multiprocess_mode='livesum')

            self._summary = Summary(f"{self.prefix}_summary",
                                    f"Summary metric for Superset", labelnames=["key"])

            self._user_activity = Counter(f"{self.prefix}_user_activity", "User activity counter",
                                          labelnames=["user_id", "action"])

        def incr(self, key: str) -> None:
            # self._gauge.labels()
            self._counter.labels(key=key).inc()

        def user_activity(self, user_id: str, action: str) -> None:
            self._user_activity.labels(user_id=user_id, action=action).inc()

        def decr(self, key: str) -> None:
            raise NotImplementedError()
            # self._gauge.labels(key=key).dec()

        def timing(self, key: str, value: float) -> None:
            self._summary.labels(key=key).observe(value)

        def gauge(self, key: str, value: float) -> None:
            self._gauge.labels(key=key).set(value)

except Exception:  # pylint: disable=broad-except
    pass
