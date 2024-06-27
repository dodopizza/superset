# DODO added #32839641

import logging
import datetime

from flask import request, Response, g, redirect
from flask_appbuilder.api import expose, protect, safe
from flask_appbuilder.models.sqla.interface import SQLAInterface
from marshmallow import ValidationError

from superset import security_manager
from superset.constants import MODEL_API_RW_METHOD_PERMISSION_MAP, RouteMethod
from superset.statement.commands.exceptions import (
    StatementAccessDeniedError,
    StatementForbiddenError,
    StatementInvalidError,
    StatementNotFoundError,
    StatementUpdateFailedError,
    StatementCreateFailedError
)
from superset.daos.statement import StatementDAO
from superset.statement.commands.update import UpdateStatementCommand
from superset.statement.commands.create import CreateStatementCommand
from superset.statement.schemas import (
    StatementGetResponseSchema,
    StatementGetSchema,
    StatementPutSchema,
    StatementPostSchema
)
from superset.teams.commands.update import UpdateTeamCommand
from superset.models.statement import Statement
from superset.views.base_api import (
    BaseSupersetModelRestApi,
    RelatedFieldFilter,
    requires_form_data,
    requires_json,
    statsd_metrics,
)
from superset.statement.filters import (
    StatementIDFilter,
    StatementFinishedFilter,
    StatementUserFirstNameFilter
)
from superset.views.filters import (
    BaseFilterRelatedRoles,
    BaseFilterRelatedUsers,
    FilterRelatedOwners,
    BaseFilterRelatedUsersFirstName
)
from superset.views.utils import (finish_onboarding, get_dodo_role, find_team_by_slug,
                                  update_user_roles)

logger = logging.getLogger(__name__)


class StatementRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Statement)

    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET.add(RouteMethod.RELATED)
    resource_name = "statement"
    allow_browser_login = True

    class_permission_name = "Statement"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    list_columns = [
        "id",
        "user.id",
        "user.first_name",
        "user.last_name",
        "user.email",
        "finished",
        "team",
        "isNewTeam",
        "team_slug",
        "isExternal",
        "created_datetime",
        "request_roles.name",
        "request_roles.id",
        "last_changed_datetime"
    ]

    search_columns = (
        "id",
        "user",
        "finished",
        "team"
    )

    order_columns = [
        "id",
        "team",
        "user",
        "created_datetime",
        "finished",
    ]

    # base_filters = [
    #     ["id", StatementIDFilter],
    # ]

    list_select_columns = list_columns
    search_filters = {
        "user": [StatementUserFirstNameFilter],
        "id": [StatementIDFilter]
    }

    base_related_field_filters = {
        "user": [["id", BaseFilterRelatedUsers, lambda: []]]
    }

    related_field_filters = {
        "user": RelatedFieldFilter("first_name", BaseFilterRelatedUsersFirstName)
    }
    allowed_rel_fields = {"user"}
    get_model_schema = StatementGetSchema()
    edit_model_schema = StatementPutSchema()
    statement_get_response_schema = StatementGetResponseSchema()
    add_model_schema = StatementPostSchema()

    @expose("/<pk>", methods=("GET",))
    @protect()
    @safe
    @statsd_metrics
    def get(
        self,
        pk: int
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
            statement = StatementDAO.get_by_id(pk)
            user = statement.user[0]
            dodo_role = get_dodo_role(user.id)
        except StatementAccessDeniedError:
            return self.response_403()
        except StatementNotFoundError:
            return self.response_404()
        result = self.statement_get_response_schema.dump(statement)
        result["dodo_role"] = dodo_role
        return self.response(200, result=result)

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
            logger.warning("validate data failed to add new statement")
            return self.response_400(message=error.messages)
        try:
            user_id = g.user.id
            item["user"] = [user_id]
            item["finished"] = False
            new_model = CreateStatementCommand(item).run()
            finished_onboarding = finish_onboarding()
            return self.response(201, result=finished_onboarding)
        except StatementInvalidError as ex:
            return self.response_422(message=ex.normalized_messages())
        except StatementCreateFailedError as ex:
            logger.error(
                "Error creating model %s: %s",
                self.__class__.__name__,
                str(ex),
                exc_info=True,
            )
            return self.response_422(message=str(ex))

    @expose("/<pk>", methods=("PUT",))
    @protect()
    @safe
    @statsd_metrics
    def put(self, pk: int) -> Response:
        """Changes a Statement
        ---
        put:
          description: >-
            Changes a Statement.
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
              description: Dashboard changed
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
            change_fields_for_statement = {
                "finished": True,
                "last_changed_datetime": datetime.datetime.utcnow().isoformat()
            }
            changed_statement = UpdateStatementCommand(
                pk,
                change_fields_for_statement).run()
            if item.get("is_approved"):
                team_slug = item.get("team_slug")
                team_model = find_team_by_slug(team_slug)
                team_id = team_model.id
                user = changed_statement.user
                participants = {
                    "participants": user
                }
                changed_team = UpdateTeamCommand(team_id, participants).run()
                request_roles = changed_statement.request_roles
                current_roles = user[0].roles
                roles = request_roles + current_roles
                changed_user = update_user_roles(user[0], roles)
            response = self.response(
                200,
                id=changed_statement.id,
                result=self.statement_get_response_schema.dump(changed_statement),
            )
        except StatementNotFoundError:
            response = self.response_404()
        except StatementForbiddenError:
            response = self.response_403()
        except StatementInvalidError as ex:
            return self.response_422(message=ex.normalized_messages())
        except StatementUpdateFailedError as ex:
            logger.error(
                "Error updating model %s: %s",
                self.__class__.__name__,
                str(ex),
                exc_info=True,
            )
            response = self.response_422(message=str(ex))
        return response
