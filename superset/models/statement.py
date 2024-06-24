# DODO added #32839641
from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Boolean,
    String,
    DateTime,
    Table

)

from flask_appbuilder import Model

from superset import security_manager
from superset.utils import core as utils


statement_user = Table(
    "statement_user",
    Model.metadata,
    Column("id", Integer, primary_key=True),
    Column("statements_id", ForeignKey("statements.id")),
    Column("user_id", ForeignKey("ab_user.id")),
)


StatementRoles = Table(
    "statement_roles",
    Model.metadata,
    Column("id", Integer, primary_key=True),
    Column(
        "statement_id",
        Integer,
        ForeignKey("statements.id", ondelete="CASCADE"),
        nullable=False,
    ),
    Column(
        "role_id",
        Integer,
        ForeignKey("ab_role.id", ondelete="CASCADE"),
        nullable=False,
    ),
)


class Statement(Model):

    """Dodo teams for Superset"""

    __tablename__ = "statements"

    id = Column(Integer, primary_key=True)
    user = relationship(
        security_manager.user_model, secondary=statement_user, passive_deletes=True,
    )
    finished = Column(Boolean, default=False)
    team = Column(String, nullable=False)
    isNewTeam = Column(Boolean, default=False)
    team_slug = Column(String, nullable=False)
    isExternal = Column(Boolean, nullable=False)
    created_datetime = Column(DateTime, default=datetime.utcnow())
    request_roles = relationship(security_manager.role_model, secondary=StatementRoles)
    last_changed_datetime = Column(DateTime, default=datetime.utcnow())
