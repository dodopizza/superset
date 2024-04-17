import logging
from flask_http_middleware import BaseHTTPMiddleware
from flask import Request, make_response
import datetime

logger = logging.getLogger(__name__)

logout_url = "http://localhost:8088/logout/"


class LogRoutersMiddleware(BaseHTTPMiddleware):
    def __init__(self):
        super().__init__()

    def dispatch(self, request, call_next):
        # parameters = request.form.to_dict()
        # parameters["cookies"]["test_access_time"] = datetime.datetime.now().isoformat()
        # request.cookies["test_acces_time"] = datetime.datetime.now().isoformat()
        logger.info(f"url: {request.url},"
                    f" endpoint: {request.endpoint},"
                    f" path: {request.path},"
                    f" cookies: {request.cookies}")
        response = make_response(request)
        response.set_cookie("test_access_time", datetime.datetime.now().isoformat())
        return call_next(response)
