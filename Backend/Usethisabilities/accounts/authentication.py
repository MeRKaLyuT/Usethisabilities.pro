from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken, TokenError

User = get_user_model()

class CookieAuthentication(BaseAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIES.get(settings.AUTH_COOKIE_ACCESS) # try to change this to "access_token"

        if not raw_token:
            return None

        try:
            access = AccessToken(raw_token)
        except TokenError:
            raise AuthenticationFailed({"detail": ["Invalid token"]})

        user_id = access.get("user_id")

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise AuthenticationFailed({"detail": ["No user"]})

        if not user.is_active:
            raise AuthenticationFailed({"detail": ["This user is blocked"]})

        return (user, raw_token)