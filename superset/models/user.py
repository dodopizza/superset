from flask_appbuilder.security.sqla.models import User
from sqlalchemy import Column, String, Boolean, DateTime


class DodoUser(User):
    """
    Extending the User Model for DodoBrands needs
    """

    __tablename__ = 'ab_user'
    language = Column(String(32), default='en')
    IsOnboardingFinished = Column(Boolean, default=False)
    OnboardingStartedTime = Column(DateTime, nullable=False)

    @property
    def get_language(self):
        return self.language or "en"
