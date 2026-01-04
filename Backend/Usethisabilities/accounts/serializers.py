from django.contrib.auth import get_user_model
from rest_framework import serializers


User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=12,
        max_length=80,
        style={"input_type": "password"},
    )
    password_confirm = serializers.CharField()
    username = serializers.CharField(max_length=30)

    class Meta:
        model = User
        fields = ("id", "email", "username", "password", "password_confirm")
        read_only_fields = ("id",)

    def validate(self, attrs):
        if attrs["password"] != attrs["password_confirm"]:
            raise serializers.ValidationError("Passwords do not match")
        return attrs

    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        user = User.objects.create_user(password=password, **validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, style={"input_type": "password"})

    def validate(self, attrs):
        email = attrs.get("email")
        password = attrs.get("password")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password")

        if not user.is_active:
            raise serializers.ValidationError("This user is blocked")

        if not user.check_password(password): # the check_password is from django models (ur CustomUser inherit from abstractuser)
            raise serializers.ValidationError("Invalid email or password")

        attrs["user"] = user
        return attrs


# this serializer is needed for the user output (like white list but for the data)
class MeSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email") # add other types after the test (username, avatar...)
        