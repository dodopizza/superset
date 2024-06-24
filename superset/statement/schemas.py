# DODO added #32839641

import enum
from marshmallow import fields, Schema


class CustomDodoRoles(enum.Enum):
    Use_data = "Use data"
    Analyze_Data = "Analyze data"
    Create_Data = "Create data"
    Input_Data = "Input data"


class UserSchema(Schema):
    id = fields.Int()
    username = fields.String()
    first_name = fields.String()
    last_name = fields.String()


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
    pass


class StatementPostSchema(Schema):
    isNewTeam = fields.Boolean()
    team = fields.String()
    team_slug = fields.String()
    isExternal = fields.Boolean()
    request_roles = fields.List(fields.String(validate=CustomDodoRoles))
