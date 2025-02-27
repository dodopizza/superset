import logging
from flask_http_middleware import BaseHTTPMiddleware
from flask_login import current_user

logger = logging.getLogger(__name__)


class LogRoutersMiddleware(BaseHTTPMiddleware):
    def __init__(self):
        super().__init__()

    def dispatch(self, request, call_next):
        response = call_next(request)
        
        if 400 <= response.status_code < 600:
            logger.error(
                f"Error response - status: {response.status_code}, "
                f"url: {request.url}, "
                f"is_authenticated: {current_user.is_authenticated}", 
                exc_info=True
            )
        
        return response
