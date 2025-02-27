import logging
import json
from flask_http_middleware import BaseHTTPMiddleware
from flask_login import current_user
from typing import Any

logger = logging.getLogger(__name__)


class LogRoutersMiddleware(BaseHTTPMiddleware):
    def __init__(self):
        super().__init__()

    def _get_request_body(self, request) -> dict[str, Any]:
        """Extract request body safely."""
        try:
            return request.get_json(silent=True) or {}
        except Exception:
            return {}

    def _get_response_body(self, response) -> dict[str, Any]:
        """Extract response body safely."""
        try:
            return json.loads(response.get_data(as_text=True)) or {}
        except Exception:
            return {}

    def dispatch(self, request, call_next):
        response = call_next(request)
        
        if 400 <= response.status_code < 600:
            logger.error(
                f"Error response - status: {response.status_code}",
                extra={
                    "method": request.method,
                    "url": request.url,
                    "status_code": response.status_code,
                    "is_authenticated": current_user.is_authenticated,
                    "request": {
                        "body": self._get_request_body(request),
                        "args": dict(request.args)
                    },
                    "response": {
                        "body": self._get_response_body(response)
                    }
                },
                exc_info=True
            )
        
        return response
