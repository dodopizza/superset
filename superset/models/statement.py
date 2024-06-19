# DODO added #32839641
from datetime import datetime

from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    Boolean,
    String,
    DateTime,

)

from flask_appbuilder import Model
from superset.utils import core as utils


class Statement(Model):

    """Dodo teams for Superset"""

    __tablename__ = "statements"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("ab_user.id"))
    finished = Column(Boolean, default=False)
    team = Column(String, nullable=False)
    isNewTeam = Column(Boolean, default=False)
    team_slug = Column(String, nullable=False)
    isExternal = Column(Boolean, nullable=False)
    created_datetime = Column(DateTime, default=datetime.utcnow())
    request_roles = Column(utils.MediumText())
    last_changed_datetime = Column(DateTime, default=datetime.utcnow())
