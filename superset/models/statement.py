# DODO added #32839641
from datetime import datetime

from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Boolean,
    String,
    DateTime,
    Table,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from flask_appbuilder import Model
from flask_appbuilder.security.sqla.models import User
from superset.utils import core as utils
from superset import security_manager


class Statement(Model):

    """Dodo teams for Superset"""

    __tablename__ = "statements"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("ab_user.id"))
    finished = Column(Boolean, default=False)
    team = Column(String, nullable=False)
    isNewTeam = Column(Boolean, default=False)
    team_tag = Column(String, nullable=False)
    isExternal = Column(Boolean, nullable=False)
    created_datetime = Column(DateTime, default=datetime.utcnow())
    request_roles = Column(utils.MediumText())
    last_changed_datetime = Column(DateTime, default=datetime.utcnow())
