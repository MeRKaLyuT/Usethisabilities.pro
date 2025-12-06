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

    class Meta:
        model = User
        fields = ("id", "email", "password")
        read_only_fields = ("id")

    def create(self, validated_data):
        password =  validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
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
class MeSerializer(serializers.Serializer):
    class Meta:
        model = User
        fields = ("id", "email") # add other types after the test (username, avatar...)
        