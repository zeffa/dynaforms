from typing import Any, Dict

from django.contrib.auth import get_user_model, password_validation
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs) -> Dict[str, Any]:
        super().validate(attrs)  # Required
        return self.build_response(self.user)

    def build_response(self, user):
        refresh = self.get_token(user)
        return {
            "access": str(refresh.access_token),
            "username": user.username,
            "is_admin": user.is_superuser,
        }


class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = User
        fields = ["first_name", "last_name", "username", "password"]

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    @transaction.atomic
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class EmptySerializer(serializers.Serializer):
    pass
