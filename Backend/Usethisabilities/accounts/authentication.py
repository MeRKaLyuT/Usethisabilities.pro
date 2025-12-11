from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework_simplejwt.tokens import AccessToken, TokenError

User = get_user_model()

class CookieAuthentication(BaseAuthentication):
    def authenticate(self, request):
        raw_token = request.COOKIE.get(settings.AUTH_COOKIE_ACCESS)

        if not raw_token:
            return None

        try:
            access = AccessToken(raw_token)
        except TokenError:
            AuthenticationFailed("Invalid token")

        user_id = access.get("user_id")

        try:
            user =User.objects.get(id=user_id)
        except User.DoesNotExists:
            raise AuthenticationFailed("No user")

        if not user.is_active:
            raise AuthenticationFailed("This user is blocked")

        return (user, raw_token)