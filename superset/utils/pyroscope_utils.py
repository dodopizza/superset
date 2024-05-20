import pyroscope
from datetime import datetime
import time


class PyroscopeMetrics:

    def dashboard_wrapper(self, func):
        def wrapper(*args, **kwargs):
            with pyroscope.tag_wrapper({"dashboard": kwargs.get("dash").id}):
                start_time = time.time()
                func(*args, **kwargs)
                time.time() - start_time
        return wrapper
