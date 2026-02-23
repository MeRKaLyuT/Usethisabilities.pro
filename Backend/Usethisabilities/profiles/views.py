from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import MeProfileSerializer
from .models import Profile


@api_view(['GET'])
@permission_classes([AllowAny])
def ping(_request):
    return Response({'The server is working fine'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    return Response({'id': request.user.id, 'username': request.user.username})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, _ = Profile.objects.get_or_create(user=request.user)
        serializer = MeProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)