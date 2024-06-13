# DODO added #32839641
import logging
from typing import Callable, Optional


from flask import make_response, redirect, request, Response, send_file, url_for
from flask_appbuilder.api import expose, protect, rison, safe
from flask_appbuilder.hooks import before_request
from flask_appbuilder.models.sqla.interface import SQLAInterface
from marshmallow import ValidationError


from superset import is_feature_enabled
from superset.constants import MODEL_API_RW_METHOD_PERMISSION_MAP, RouteMethod
from superset.onboarding.commands.create import CreateDashboardCommand
from superset.onboarding.commands.exceptions import (
    DashboardAccessDeniedError,
    DashboardCreateFailedError,
    DashboardDeleteFailedError,
    DashboardForbiddenError,
    DashboardInvalidError,
    DashboardNotFoundError,
    DashboardUpdateFailedError,
)
from superset.daos.onboarding import OnboardingDAO
from superset.onboarding.commands.update import UpdateDashboardCommand
from superset.onboarding.schemas import (
    OnboardingPostSchema,
    OnboardingPutSchema,
    OnboardingGetResponseSchema,
    get_delete_ids_schema,
    get_export_ids_schema,
    get_fav_star_ids_schema,
    openapi_spec_methods_override,
    thumbnail_query_schema,
)
from superset.extensions import event_logger
from superset.models.user_info import UserInfo
from superset.views.base_api import (
    BaseSupersetModelRestApi,
    requires_json,
    statsd_metrics,
)

logger = logging.getLogger(__name__)


class OnboardingRestApi(BaseSupersetModelRestApi):
    datamodel = SQLAInterface(UserInfo)

    @before_request(only=["thumbnail"])
    def ensure_thumbnails_enabled(self) -> Optional[Response]:
        if not is_feature_enabled("THUMBNAILS"):
            return self.response_404()
        return None

    include_route_methods = RouteMethod.REST_MODEL_VIEW_CRUD_SET | {
        RouteMethod.EXPORT,
        RouteMethod.IMPORT,
        RouteMethod.RELATED,
        "bulk_delete",  # not using RouteMethod since locally defined
        "favorite_status",
        "add_favorite",
        "remove_favorite",
        "get_charts",
        "get_datasets",
        "get_embedded",
        "set_embedded",
        "delete_embedded",
        "thumbnail",
        "copy_dash",
    }
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

    add_model_schema = OnboardingPostSchema()
    edit_model_schema = OnboardingPutSchema()
    onboarding_get_response_schema = OnboardingGetResponseSchema()

    openapi_spec_tag = "Dashboards"
    """ Override the name set for this collection of endpoints """
    apispec_parameter_schemas = {
        "get_delete_ids_schema": get_delete_ids_schema,
        "get_export_ids_schema": get_export_ids_schema,
        "thumbnail_query_schema": thumbnail_query_schema,
        "get_fav_star_ids_schema": get_fav_star_ids_schema,
    }

    @expose("/", methods=("GET",))
    @protect()
    @safe
    @statsd_metrics
    def get(
        self,
        user_info: UserInfo
    ) -> Response:
        """Gets a dashboard
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
            user_info = OnboardingDAO.get_by_user_id(id_or_slug)
        except DashboardAccessDeniedError:
            return self.response_403()
        except DashboardNotFoundError:
            return self.response_404()
        result = self.onboarding_get_response_schema.dump(user_info)
        return self.response(200, result=result)

    @expose("/", methods=("PUT",))
    @protect()
    @safe
    @statsd_metrics
    @event_logger.log_this_with_context(
        action=lambda self, *args, **kwargs: f"{self.__class__.__name__}.put",
        log_to_statsd=False,
    )
    @requires_json
    def put(self, pk: int) -> Response:
        """Changes a Dashboard
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
            changed_model = UpdateDashboardCommand(pk, item).run()
            last_modified_time = changed_model.changed_on.replace(
                microsecond=0
            ).timestamp()
            response = self.response(
                200,
                id=changed_model.id,
                result=item,
                last_modified_time=last_modified_time,
            )
        except DashboardNotFoundError:
            response = self.response_404()
        except DashboardForbiddenError:
            response = self.response_403()
        except DashboardInvalidError as ex:
            return self.response_422(message=ex.normalized_messages())
        except DashboardUpdateFailedError as ex:
            logger.error(
                "Error updating model %s: %s",
                self.__class__.__name__,
                str(ex),
                exc_info=True,
            )
            response = self.response_422(message=str(ex))
        return response


