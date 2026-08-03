# pyrefly: ignore [missing-import]
from django.contrib.auth.backends import ModelBackend
# pyrefly: ignore [missing-import]
from django.contrib.auth import get_user_model
# pyrefly: ignore [missing-import]
from django.db.models import Q

class EmailOrUsernameModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        if not username:
            return None
        UserModel = get_user_model()
        # Query by exact username or email (django_mongodb_backend supported)
        user = UserModel.objects.filter(username=username).first() or UserModel.objects.filter(email=username).first()
        if user and user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None
