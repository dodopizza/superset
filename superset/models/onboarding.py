from __future__ import annotations

from flask_appbuilder import Model
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Table,
    Text,
)

from superset.models.helpers import AuditMixinNullable, ImportExportMixin


metadata = Model.metadata  # pylint: disable=no-member
onboarding_user = Table(
    "onboarding_user",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("user_id", Integer, ForeignKey("ab_user.id", ondelete="CASCADE")),
    Column("slice_id", Integer, ForeignKey("onboarding.id", ondelete="CASCADE")),
)


class OnboardingUser(  # DODO created 32839638
    Model, AuditMixinNullable, ImportExportMixin
):
    """A slice is essentially a report or a view on data"""

    __tablename__ = "onboarding"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("ab_user.id"))
    language = Column(String(25))
    IsOnboardingFinished = Column(Boolean, default=False)
    OnboardingStartedTime = Column(DateTime, nullable=False)
