from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed


class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        try:
            user = super().get_user(validated_token)
            return user
        except Exception as exc:
            raise AuthenticationFailed("Invalid credentials") from exc
