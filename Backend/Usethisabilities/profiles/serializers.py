from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Profile

User = get_user_model()

# this serializer is needed for the user output (like white list but for the data)
class MeProfileSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(source="user.id", read_only=True)
    email = serializers.EmailField(source="user.email")
    username = serializers.CharField(source="user.username")

    class Meta: # meta is just like a rules which fields from the user possible to use
        model = Profile
        fields = ("user_id", "email", "username", "bio") # add other types after the test (username, avatar...)
