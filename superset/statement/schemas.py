# DODO added #32839641

import enum
from marshmallow import fields, Schema


class CustomDodoRoles(enum.Enum):
    Check_Data = "Check data"
    Create_Data = "Create data"
    Vizualize_data = "Vizualize data"
    Input_Data = "Input data"


class RolesSchema(Schema):
    id = fields.Int()
    name = fields.String()


class UserSchema(Schema):
    id = fields.Int()
    username = fields.String()
    first_name = fields.String()
    last_name = fields.String()
    email = fields.String()
    roles = fields.List(fields.Nested(RolesSchema))


class StatementGetResponseSchema(Schema):
    id = fields.Int()
    user = fields.List(fields.Nested(UserSchema()))
    finished = fields.Boolean()
    team = fields.String()
    isNewTeam = fields.Boolean()
    team_slug = fields.String()
    isExternal = fields.Boolean()
    created_datetime = fields.DateTime()
    request_roles = fields.List(fields.String(validate=CustomDodoRoles))
    last_changed_datetime = fields.DateTime()


class StatementGetSchema(Schema):
    isExternal = fields.Boolean()
    query = fields.String()


class StatementPutSchema(Schema):
    team_slug = fields.String()
    is_approved = fields.Boolean()
    request_roles = fields.List(fields.String(validate=CustomDodoRoles))


class StatementPostSchema(Schema):
    isNewTeam = fields.Boolean()
    team = fields.String()
    team_slug = fields.String()
    isExternal = fields.Boolean()
    request_roles = fields.List(fields.String(validate=CustomDodoRoles))
