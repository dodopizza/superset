# DODO added #32839641
import logging
from typing import Callable, Optional


from flask import make_response, redirect, request, Response, send_file, url_for, g
from flask_appbuilder.api import expose, protect, rison, safe
from flask_appbuilder.models.sqla.interface import SQLAInterface
from marshmallow import ValidationError

from superset.constants import MODEL_API_RW_METHOD_PERMISSION_MAP, RouteMethod
from superset.onboarding.commands.exceptions import (
    OnboardingAccessDeniedError,
    OnboardingForbiddenError,
    OnboardingInvalidError,
    OnboardingNotFoundError,
    OnboardingUpdateFailedError,
)
from superset.daos.onboarding import OnboardingDAO
from superset.onboarding.commands.update import UpdateOnboardingCommand
from superset.onboarding.schemas import (
    OnboardingPutSchema,
    OnboardingGetResponseSchema,
)
from superset.models.user_info import UserInfo
from superset.views.base_api import (
    BaseSupersetModelRestApi,
    statsd_metrics,
)

logger = logging.getLogger(__name__)


class OnboardingRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(UserInfo)

    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET
    resource_name = "onboarding"
    allow_browser_login = True

    class_permission_name = "Onboarding"
    method_permission_name = MODEL_API_RW_METHOD_PERMISSION_MAP

    list_columns = [
        "id",
        "isOnboardingFinished",
        "onboardingStartedTime",
        "language",
        "user_id",
        "dodo_role",
    ]

    edit_model_schema = OnboardingPutSchema()
    onboarding_get_response_schema = OnboardingGetResponseSchema()

    @expose("/", methods=("GET",))
    @protect()
    @safe
    @statsd_metrics
    def get(
        self
    ) -> Response:
        """Gets onboarding information
        ---
        get:
          description: >-
            Get a dashboard
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
            user_info = OnboardingDAO.get_by_user_id(user_id)
        except OnboardingAccessDeniedError:
            return self.response_403()
        except OnboardingNotFoundError:
            return self.response_404()
        result = self.onboarding_get_response_schema.dump(user_info)
        result = {
            **result,
            "email": g.user.email,
            "last_name": g.user.last_name,
            "first_name": g.user.first_name
        }
        return self.response(200, result=result)

    @expose("/", methods=("PUT",))
    @protect()
    @safe
    @statsd_metrics
    def put(self) -> Response:
        """Changes Onboarding
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
            id_model = OnboardingDAO.get_by_user_id(user_id).id
            changed_model = UpdateOnboardingCommand(id_model, item).run()
            response = self.response(200, result=item)
        except OnboardingNotFoundError:
            response = self.response_404()
        except OnboardingForbiddenError:
            response = self.response_403()
        except OnboardingInvalidError as ex:
            return self.response_422(message=ex.normalized_messages())
        except OnboardingUpdateFailedError as ex:
            logger.error(
                "Error updating model %s: %s",
                self.__class__.__name__,
                str(ex),
                exc_info=True,
            )
            response = self.response_422(message=str(ex))
        return response


