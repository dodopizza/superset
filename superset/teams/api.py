# DODO added #32839641
import logging
from typing import Callable, Optional


from flask import make_response, redirect, request, Response, send_file, url_for, g
from flask_appbuilder.api import expose, protect, rison, safe
from flask_appbuilder.models.sqla.interface import SQLAInterface
from marshmallow import ValidationError

from superset.constants import MODEL_API_RW_METHOD_PERMISSION_MAP, RouteMethod
from superset.teams.commands.exceptions import (
    TeamAccessDeniedError,
    TeamForbiddenError,
    TeamInvalidError,
    TeamNotFoundError,
    TeamUpdateFailedError,
)
from superset.daos.teams import TeamDAO
from superset.teams.commands.update import UpdateOnboardingCommand
from superset.teams.schemas import (
    TeamGetResponseSchema,
    TeamGetSchema
)
from superset.models.team import Team
from superset.views.base_api import (
    BaseSupersetModelRestApi,
    statsd_metrics,
)

logger = logging.getLogger(__name__)


class TeamRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Team)

    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET
    resource_name = "team"
    allow_browser_login = True

    class_permission_name = "Team"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    list_columns = [
        "id",
        "isExternal",
        "tag.team",
        "roles",
        "participants.first_name",
        "participants.last_name",
        "participants.id"
    ]

    get_model_schema = TeamGetSchema()
    team_get_response_schema = TeamGetResponseSchema()

    @expose("/", methods=("GET",))
    @protect()
    @safe
    @statsd_metrics
    def get(
        self
    ) -> Response:
        """Gets Teams
        ---
        get:
          description: >-
            Get a teams
          parameters:
          - in: path
            schema:
              type: string
            name: id_or_slug
            description: Either the id of the dashboard, or its slug
          responses:
            200:
              description: Dashboard
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      result:
                        $ref: '#/components/schemas/DashboardGetResponseSchema'
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            403:
              $ref: '#/components/responses/403'
            404:
              $ref: '#/components/responses/404'
        """
        try:
            is_external = bool(int(request.args.get("isExternal")))
            subname = request.args.get("query")
            teams = TeamDAO.get_by_name_and_external(subname, is_external)
        except TeamAccessDeniedError:
            return self.response_403()
        except TeamNotFoundError:
            return self.response_404()
        result = self.team_get_response_schema.dump(teams)
        return self.response(200, result=result)
