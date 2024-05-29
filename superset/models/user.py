from flask_appbuilder.security.sqla.models import User
from sqlalchemy import Column, String, Boolean, DateTime

from superset import db
from superset.models.helpers import AuditMixinNullable


class DodoUser(User):
    """
    Extending the User Model for DodoBrands needs
    """

    __tablename__ = 'ab_user'
    language = Column(String(32), default='en')
    IsOnboardingFinished = Column(Boolean, default=False)
    OnboardingStartedTime = Column(DateTime, nullable=True)

    @property
    def get_language(self):
        return self.language or "en"

    @classmethod
    def get(cls, user_id: int):
        db.session.get(user_id)
        qry = db.session.get(user_id)
        return qry.one_or_none()
