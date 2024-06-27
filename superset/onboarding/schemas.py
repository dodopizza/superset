# DODO added #32839641

from marshmallow import fields, Schema


class OnboardingGetResponseSchema(Schema):
    id = fields.Int()
    first_name = fields.String()
    last_name = fields.String()
    email = fields.String()
    isOnboardingFinished = fields.Boolean()
    onboardingStartedTime = fields.DateTime(missing=True)


class OnboardingPutSchema(Schema):
    dodo_role = fields.String()
