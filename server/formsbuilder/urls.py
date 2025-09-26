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
router.register(r"form-templates", FormTemplateViewSet, basename='form-template')
router.register(r"form-fields", FormFieldViewSet, basename='form-field')
router.register(r"form-submissions", FormSubmissionViewSet, basename='form-submission')
router.register(r"form-field-options", FormFieldOptionViewSet, basename='form-field-option')
router.register(r"statistics", FormStatisticsViewSet, basename='form-statistics')

urlpatterns = [
    path("", include(router.urls)),
]
