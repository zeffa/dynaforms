from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FormTemplateViewSet, FormFieldViewSet, FormSubmissionViewSet, FormFieldOptionViewSet
)

router = DefaultRouter()
router.register(r'form-templates', FormTemplateViewSet)
router.register(r'form-fields', FormFieldViewSet)
router.register(r'form-submissions', FormSubmissionViewSet)
router.register(r'form-field-options', FormFieldOptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
