# DODO added #32839641
import logging
from typing import Callable, Optional


from flask import make_response, redirect, request, Response, send_file, url_for, g
from flask_appbuilder.api import expose, protect, rison, safe
from flask_appbuilder.models.sqla.interface import SQLAInterface
from marshmallow import ValidationError

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
from superset.models.statement import Statement
from superset.views.base_api import (
    BaseSupersetModelRestApi,
    statsd_metrics,
)
from superset.views.utils import finish_onboarding

logger = logging.getLogger(__name__)


class StatementRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(Statement)

    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET
    resource_name = "statement"
    allow_browser_login = True

    class_permission_name = "Statement"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    list_columns = [
        "id",
        "user_id",
        "finished",
        "team_id",
        "created_datetime",
        "last_changed_datetime",
    ]

    get_model_schema = StatementGetSchema()
    edit_model_schema = StatementPutSchema()
    team_get_response_schema = StatementGetResponseSchema()
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
        except StatementAccessDeniedError:
            return self.response_403()
        except StatementNotFoundError:
            return self.response_404()
        result = self.team_get_response_schema.dump(statement)
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
            changed_model = UpdateStatementCommand(pk, item).run()
            response = self.response(
                200,
                id=changed_model.id,
                result=item,
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
