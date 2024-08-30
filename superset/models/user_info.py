# DODO added #33835937

from sqlalchemy import Column, String, ForeignKey, Integer, Boolean, DateTime
from sqlalchemy.orm import relationship
from flask_appbuilder import Model

from superset import security_manager

from superset.utils import core as utils


class UserInfo(Model):

    """Extra info about user"""

    __tablename__ = "user_info"

    id = Column(Integer, primary_key=True)
    isOnboardingFinished = Column(Boolean, default=False)  # DODO added #32839638
    onboardingStartedTime = Column(DateTime, nullable=True)  # DODO added #32839638
    language = Column(String(32), default="ru")
    user_id = Column(Integer, ForeignKey("ab_user.id"))
    user = relationship(
        security_manager.user_model,
        backref="user_info"
    )
    data_auth_dodo = Column(utils.MediumText())
    country_num = Column(Integer, nullable=True)
    country_name = Column(String, nullable=True)
    dodo_role = Column(String(32), nullable=True)

