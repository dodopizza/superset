# DODO added #32839641

import logging
from flask import request, Response, g
from flask_appbuilder.models.sqla.interface import SQLAInterface
from flask_appbuilder.api import expose, protect, safe
from marshmallow import ValidationError

from superset.extensions import (
    security_manager,
)
from superset.constants import MODEL_API_RW_METHOD_PERMISSION_MAP, RouteMethod
from superset.teams.commands.exceptions import (
    TeamInvalidError,
    TeamCreateFailedError
)
from superset.teams.schemas import (
    TeamGetResponseSchema,
    TeamGetSchema,
    TeamPostSchema,
    AddUserSchema
)
from superset.teams.commands.create import CreateTeamCommand
from superset.teams.commands.update import UpdateTeamCommand
from superset.daos.teams import TeamDAO
from superset.teams.filters import (
    TeamNameFilter,
    TeamExternalFilter,
    TeamIDFilter,
    TeamSlugFilter
)
from superset.models.team import Team
from superset.views.base_api import (
    BaseSupersetModelRestApi,
    statsd_metrics,
)

logger = logging.getLogger(__name__)


class TeamRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Team)

    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET | {
        "add_user",
        "remove_user"
    }
    resource_name = "team"
    allow_browser_login = True

    class_permission_name = "Team"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    search_columns = (
        "id",
        "slug",
        "isExternal",
        "name"
    )

    search_filters = {
        "name": [TeamNameFilter],
        "isExternal": [TeamExternalFilter],
        "id": [TeamIDFilter],
        "slug": [TeamSlugFilter]
    }

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
    add_user_schema = AddUserSchema()

    @expose("/<pk>", methods=("GET",))
    @protect()
    @safe
    @statsd_metrics
    def get(self, pk: int) -> Response:
        """Creates a new Dashboard
        ---
        post:
          description: >-
            Get a Team.
          requestBody:
            description: Dashboard schema
            required: true
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
          responses:
            201:
              description: Dashboard added
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      id:
                        type: number
                      result:
                        $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            404:
              $ref: '#/components/responses/404'
            500:
              $ref: '#/components/responses/500'
        """
        try:
            team = TeamDAO().find_by_id(pk)
            return self.response(201, result=self.get_model_schema.dump(team))
        except TeamInvalidError as ex:
            return self.response_422(message=ex.normalized_messages())
        except TeamCreateFailedError as ex:
            logger.error(
                "Error creating model %s: %s",
                self.__class__.__name__,
                str(ex),
                exc_info=True,
            )
            return self.response_422(message=str(ex))



    @expose("/", methods=("POST",))
    @protect()
    @safe
    @statsd_metrics
    def post(self) -> Response:
        """Creates a new Dashboard
        ---
        post:
          description: >-
            Create a new Dashboard.
          requestBody:
            description: Dashboard schema
            required: true
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
          responses:
            201:
              description: Dashboard added
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      id:
                        type: number
                      result:
                        $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            404:
              $ref: '#/components/responses/404'
            500:
              $ref: '#/components/responses/500'
        """
        try:
            item = self.add_model_schema.load(request.json)
        # This validates custom Schema with custom validations
        except ValidationError as error:
            logger.warning("validate data failed to add new Team")
            return self.response_400(message=error.messages)
        try:
            new_model = CreateTeamCommand(item).run()
            return self.response(201, result={"status": "cool"})
        except TeamInvalidError as ex:
            return self.response_422(message=ex.normalized_messages())
        except TeamCreateFailedError as ex:
            logger.error(
                "Error creating model %s: %s",
                self.__class__.__name__,
                str(ex),
                exc_info=True,
            )
            return self.response_422(message=str(ex))

    @expose("/add_user", methods=("POST",))
    @protect()
    @safe
    @statsd_metrics
    def add_user(self) -> Response:
        """Creates a new Dashboard
        ---
        post:
          description: >-
            Create a new Dashboard.
          requestBody:
            description: Dashboard schema
            required: true
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
          responses:
            201:
              description: Dashboard added
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      id:
                        type: number
                      result:
                        $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            404:
              $ref: '#/components/responses/404'
            500:
              $ref: '#/components/responses/500'
        """
        try:
            item = self.add_user_schema.load(request.json)
        # This validates custom Schema with custom validations
        except ValidationError as error:
            logger.warning("validate data failed to add new Team")
            return self.response_400(message=error.messages)
        try:
            team_id = item.get("team_id")
            user = security_manager.get_user_by_id(item.get("user_id"))
            changed_model = UpdateTeamCommand(team_id, {"participants": [user]},
                                              "add_user").run()
            return self.response(201, result={"status": "successful"})
        except TeamInvalidError as ex:
            return self.response_422(message=ex.normalized_messages())
        except TeamCreateFailedError as ex:
            logger.error(
                "Error creating model %s: %s",
                self.__class__.__name__,
                str(ex),
                exc_info=True,
            )
            return self.response_422(message=str(ex))

    @expose("/remove_user", methods=("POST",))
    @protect()
    @safe
    @statsd_metrics
    def remove_user(self) -> Response:
        """Creates a new Dashboard
        ---
        post:
          description: >-
            Create a new Dashboard.
          requestBody:
            description: Dashboard schema
            required: true
            content:
              application/json:
                schema:
                  $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
          responses:
            201:
              description: Dashboard added
              content:
                application/json:
                  schema:
                    type: object
                    properties:
                      id:
                        type: number
                      result:
                        $ref: '#/components/schemas/{{self.__class__.__name__}}.post'
            400:
              $ref: '#/components/responses/400'
            401:
              $ref: '#/components/responses/401'
            404:
              $ref: '#/components/responses/404'
            500:
              $ref: '#/components/responses/500'
        """
        try:
            item = self.add_user_schema.load(request.json)
        # This validates custom Schema with custom validations
        except ValidationError as error:
            logger.warning("validate data failed to add new Team")
            return self.response_400(message=error.messages)
        try:
            team_id = item.get("team_id")
            user = security_manager.get_user_by_id(item.get("user_id"))
            changed_model = UpdateTeamCommand(team_id, {"participants": [user]},
                                              "remove_user").run()
            return self.response(201, result={"status": "successful"})
        except TeamInvalidError as ex:
            return self.response_422(message=ex.normalized_messages())
        except TeamCreateFailedError as ex:
            logger.error(
                "Error creating model %s: %s",
                self.__class__.__name__,
                str(ex),
                exc_info=True,
            )
            return self.response_422(message=str(ex))
