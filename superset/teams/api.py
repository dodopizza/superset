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
    TeamPostSchema,
    TeamGetResponseSchema,
    TeamPutSchema
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

    post_model_schema = TeamPostSchema()
    put_model_schema = TeamPutSchema()
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
            user_id = g.user.id
            team = TeamDAO.get_by_name_and_external(user_id)
        except TeamAccessDeniedError:
            return self.response_403()
        except TeamNotFoundError:
            return self.response_404()
        result = self.team_get_response_schema.dump(team)
        return self.response(200, result=result)

    @expose("/", methods=("POST",))
    @protect()
    @safe
    @statsd_metrics
    def post(self) -> Response:
        """Changes Team
        ---
        post:
          description: >-
            Changes a Dashboard.
          parameters:
          - in: path
            schema:
              type: integer
            name: pk
          requestBody:
            description: Dashboard schema
            required: true
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/{{self.__class__.__name__}}.put'
          responses:
            200:
              description: Onboarding changed
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      id:
                        type: number
                      result:
                        $ref: '#/components/schemas/{{self.__class__.__name__}}.put'
                      last_modified_time:
                        type: number
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            403:
              $ref: '#/components/responses/403'
            404:
              $ref: '#/components/responses/404'
            422:
              $ref: '#/components/responses/422'
            500:
              $ref: '#/components/responses/500'
        """
        try:
            item = self.post_model_schema.load(request.json)
        # This validates custom Schema with custom validations
        except ValidationError as error:
            return self.response_400(message=error.messages)
        try:
            name = item.get("name")
            is_external = item.get("isExternal")
            id_model = TeamDAO.get_by_name_and_external(name, is_external)
            changed_model = UpdateOnboardingCommand(id_model, item).run()
            logger.error(changed_model)
            response = self.response(200, result=item)
        except TeamNotFoundError:
            response = self.response_404()
        except TeamForbiddenError:
            response = self.response_403()
        except TeamInvalidError as ex:
            return self.response_422(message=ex.normalized_messages())
        except TeamUpdateFailedError as ex:
            logger.error(
                "Error updating model %s: %s",
                self.__class__.__name__,
                str(ex),
                exc_info=True,
            )
            response = self.response_422(message=str(ex))
        return response

    @expose("/", methods=("PUT",))
    @protect()
    @safe
    @statsd_metrics
    def put(self) -> Response:
        """Changes Team
        ---
        put:
          description: >-
            Changes a Dashboard.
          parameters:
          - in: path
            schema:
              type: integer
            name: pk
          requestBody:
            description: Dashboard schema
            required: true
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/{{self.__class__.__name__}}.put'
          responses:
            200:
              description: Onboarding changed
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      id:
                        type: number
                      result:
                        $ref: '#/components/schemas/{{self.__class__.__name__}}.put'
                      last_modified_time:
                        type: number
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            403:
              $ref: '#/components/responses/403'
            404:
              $ref: '#/components/responses/404'
            422:
              $ref: '#/components/responses/422'
            500:
              $ref: '#/components/responses/500'
        """
        try:
            item = self.edit_model_schema.load(request.json)
        # This validates custom Schema with custom validations
        except ValidationError as error:
            return self.response_400(message=error.messages)
        try:
            user_id = g.user.id
            id_model = TeamDAO.get_by_user_id(user_id).id
            changed_model = UpdateOnboardingCommand(id_model, item).run()
            logger.error(changed_model)
            response = self.response(200, result=item)
        except TeamNotFoundError:
            response = self.response_404()
        except TeamForbiddenError:
            response = self.response_403()
        except TeamInvalidError as ex:
            return self.response_422(message=ex.normalized_messages())
        except TeamUpdateFailedError as ex:
            logger.error(
                "Error updating model %s: %s",
                self.__class__.__name__,
                str(ex),
                exc_info=True,
            )
            response = self.response_422(message=str(ex))
        return response


