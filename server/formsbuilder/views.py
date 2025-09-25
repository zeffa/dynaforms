from rest_framework import viewsets
from .models import FormTemplate, FormField, FormSubmission, FormFieldOption
from .serializers import (
    FormTemplateSerializer, FormFieldSerializer, FormSubmissionSerializer, FormFieldOptionSerializer
)


class FormTemplateViewSet(viewsets.ModelViewSet):
    queryset = FormTemplate.objects.all()
    serializer_class = FormTemplateSerializer


class FormFieldViewSet(viewsets.ModelViewSet):
    queryset = FormField.objects.all()
    serializer_class = FormFieldSerializer


class FormSubmissionViewSet(viewsets.ModelViewSet):
    queryset = FormSubmission.objects.all()
    serializer_class = FormSubmissionSerializer


class FormFieldOptionViewSet(viewsets.ModelViewSet):
    queryset = FormFieldOption.objects.all()
    serializer_class = FormFieldOptionSerializer

