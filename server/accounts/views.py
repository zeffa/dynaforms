from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from . import serializers


class AuthViewSet(viewsets.GenericViewSet):
    serializer_action_classes = {
        "register": serializers.RegistrationSerializer,
        "login": serializers.LoginSerializer,
    }

    serializer_class = serializers.EmptySerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        return self.serializer_action_classes.get(
            self.action, super().get_serializer_class()
        )

    @action(detail=False, methods=["post"])
    def login(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)

    @action(methods=["POST"], detail=False)
    def register(self, request):
        registration_data = request.data
        serializer = self.get_serializer(data=registration_data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
