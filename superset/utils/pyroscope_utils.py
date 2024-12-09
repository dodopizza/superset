from functools import wraps
from pyroscope import tag_wrapper


def profile_route(tag_name):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            with tag_wrapper({"route": tag_name}):
                return func(*args, **kwargs)
        return wrapper
    return decorator