from superset.stats_logger import BaseStatsLogger

# from superset import app
try:
    from werkzeug.middleware.dispatcher import DispatcherMiddleware
    from prometheus_client import make_wsgi_app, Gauge, Summary


    class PrometheusStatsLogger(BaseStatsLogger):
        def __init__(self, prefix: str = "superset") -> None:
            super().__init__(prefix)

            self._gauge = Gauge(f"{self.prefix}_gauge", f"Gauge metric for Superset",
                                labelnames=("key"))
            self._summary = Summary(f"{self.prefix}_summary",
                                    f"Summary metric for Superset", labelnames=("key"))

        def incr(self, key: str) -> None:
            self._gauge.labels(key).inc()

        def decr(self, key: str) -> None:
            self._gauge.labels(key).dec()

        def timing(self, key: str, value: float) -> None:
            self._summary.labels(key).observe(value)

        def gauge(self, key: str, value: float) -> None:
            self._gauge.labels(key).set(value)

except Exception:  # pylint: disable=broad-except
    pass
