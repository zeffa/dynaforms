from django.urls import include, path
from rest_framework.routers import SimpleRouter
from rest_framework_simplejwt.views import TokenVerifyView

from .views import AuthViewSet

router = SimpleRouter()
router.register(r"", AuthViewSet, basename="auth")

urlpatterns = [
    path("", include(router.urls)),
    path("verify/", TokenVerifyView.as_view(), name="verify"),
]
