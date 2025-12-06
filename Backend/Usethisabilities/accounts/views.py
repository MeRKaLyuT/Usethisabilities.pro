from django.contrib.auth import get_user_model
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

