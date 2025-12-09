from datetime import timedelta
from django.contrib.auth import get_user_model
from django.core.serializers import serialize
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from .serializers import RegisterSerializer, LoginSerializer, MeSerializer
from .services import create_token_for_user, set_auth_cookies, clear_auth_cookies
from django.conf import settings


User = get_user_model()


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        refresh_token, access_token = create_token_for_user(user)

        response_data = MeSerializer(user).data # serializer make data into the default dict {"id": "...", ...}
        response = Response(response_data, status=status.HTTP_201_CREATED) # u need to create response in any ways
        # because DRF and Django's view are must return answer object
        # we return response_data in the response because it's more convenient to login permanently after the registr.

        set_auth_cookies(response, refresh_token, access_token)

        return response


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        refresh_token, access_token = create_token_for_user(user)

        response_data = MeSerializer(user).data
        response = Response(response_data, status=status.HTTP_200_OK)

        set_auth_cookies(response, refresh_token, access_token)

        return response


class RefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get(settings.AUTH_COOKIE_REFRESH)

        if not refresh_token:
            return Response({"detail": "Refresh token missing"}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
        except TokenError:
            return Response({"detail": "Refresh token invalid or expired"}, status=status.HTTP_401_UNAUTHORIZED)

        response = Response({"detail": "Token refreshed"}, status=status.HTTP_200_OK)

        response.set_cookie(
            settings.AUTH_COOKIE_ACCESS,
            access_token,
            httponly=True,
            # secure=not settings.DEBUG,
            samesite="Lax",
            max_age=int(timedelta(minutes=15).total_seconds())
        )

        return response


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        clear_auth_cookies(response)
        return response
