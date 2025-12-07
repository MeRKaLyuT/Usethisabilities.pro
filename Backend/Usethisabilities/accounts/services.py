from datetime import timedelta
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken


def create_token_for_user(user):
    refresh_t = RefreshToken.for_user(user)
    access_t = refresh_t.access_token
    return str(refresh_t), str(access_t)

def set_auth_cookies(response, refresh_token: str, access_token: str):
    # secure_flag = not settings.DEBUG       turn it on after the prod
    cookie_params = {
        "httponly": True,
        #"secure": secure_flag,
        "samesite": "Lax", # Lax if front on another domen (base = Strict)
    }

    response.set_cookie( # access
        settings.AUTH_COOKIE_ACCESS,
        access_token,
        max_age = int(timedelta(minutes=120).total_seconds()),
        **cookie_params,
    )

    response.set_cookie( # refresh
        settings.AUTH_COOKIE_REFRESH,
        refresh_token,
        max_age= int(timedelta(days=30).total_seconds()),
        **cookie_params,
    )

def clear_auth_cookies(response):
    response.delete_cookie(settings.AUTH_COOKIE_ACCESS)
    response.delete_cookie(settings.AUTH_COOKIE_REFRESH)
    return response
