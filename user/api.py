import logging

from flask import g, Response, redirect, request
from flask_appbuilder.api import expose, safe
from flask_appbuilder.models.sqla.interface import SQLAInterface
from flask_appbuilder.security.sqla.models import User
from flask_jwt_extended.exceptions import NoAuthorizationError

from superset.constants import MODEL_API_RW_METHOD_PERMISSION_MAP, RouteMethod
from superset.views.base_api import (
    BaseSupersetModelRestApi,
    statsd_metrics,
)

from superset import app

logger = logging.getLogger(__name__)


class UserRestApi(BaseSupersetModelRestApi):
    """An api to get information about the user"""
    datamodel = SQLAInterface(User)

    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET
    resource_name = "user"
    allow_browser_login = True

    class_permission_name = "User"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    list_columns = [
        "id",
        "name",
        "isExternal",
        "slug",
        "roles.id",
        "roles.name",
        "participants.first_name",
        "participants.last_name",
        "participants.id"
    ]

    get_model_schema = TeamGetSchema()
    team_get_response_schema = TeamGetResponseSchema()
    add_model_schema = TeamPostSchema()

    @expose("/list", methods=("GET",))
    @safe
    def list(self) -> Response:
        """Get the user object corresponding to the agent making the request
        ---
        get:
          description: >-
            Returns the user object corresponding to the agent making the request,
            or returns a 401 error if the user is unauthenticated.
          responses:
            200:
              description: The current user
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      result:
                        $ref: '#/components/schemas/UserResponseSchema'
            401:
              $ref: '#/components/responses/401'
        """
        try:
            if g.user is None or g.user.is_anonymous:
                return self.response_401()
        except NoAuthorizationError:
            return self.response_401()

        return self.response(200, result=user_response_schema.dump(g.user))



