import logging
from flask_http_middleware import BaseHTTPMiddleware
from flask import Request

logger = logging.getLogger(__name__)

logout_url = "http://localhost:8088/logout/"


class LogRoutersMiddleware(BaseHTTPMiddleware):
    def __init__(self):
        super().__init__()

    def dispatch(self, request, call_next):
        logger.info(f"url: {request.url},"
                    f" endpoint: {request.endpoint},"
                    f" path: {request.path},"
                    f" cookies: {request.cookies}")
        return call_next(request)
