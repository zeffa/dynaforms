from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    FormFieldOptionViewSet,
    FormFieldViewSet,
    FormSubmissionViewSet,
    FormTemplateViewSet,
)

router = DefaultRouter()
router.register(r"form-templates", FormTemplateViewSet)
router.register(r"form-fields", FormFieldViewSet)
router.register(r"form-submissions", FormSubmissionViewSet)
router.register(r"form-field-options", FormFieldOptionViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
