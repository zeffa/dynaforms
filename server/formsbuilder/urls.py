from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    FormFieldOptionViewSet,
    FormFieldViewSet,
    FormStatisticsViewSet,
    FormSubmissionViewSet,
    FormTemplateViewSet,
)

router = DefaultRouter()
router.register(r"form-templates", FormTemplateViewSet)
router.register(r"form-fields", FormFieldViewSet)
router.register(r"form-submissions", FormSubmissionViewSet)
router.register(r"form-field-options", FormFieldOptionViewSet)
router.register(r"statistics", FormStatisticsViewSet, basename='form-statistics')

urlpatterns = [
    path("", include(router.urls)),
]
