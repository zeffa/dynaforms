from django.shortcuts import get_object_or_404
from rest_framework import viewsets

from .models import FormField, FormFieldOption, FormSubmission, FormTemplate
from .serializers import (
    FormFieldOptionSerializer,
    FormFieldSerializer,
    FormSubmissionSerializer,
    FormTemplateSerializer,
)


class FormTemplateViewSet(viewsets.ModelViewSet):
    queryset = FormTemplate.objects.all()
    serializer_class = FormTemplateSerializer

    def get_object(self):
        lookup_value = self.kwargs.get("pk")
        qs = self.get_queryset()
        obj = qs.filter(slug=lookup_value).first()
        if obj:
            return obj
        return get_object_or_404(qs, pk=lookup_value)


class FormFieldViewSet(viewsets.ModelViewSet):
    queryset = FormField.objects.all()
    serializer_class = FormFieldSerializer


class FormSubmissionViewSet(viewsets.ModelViewSet):
    queryset = FormSubmission.objects.all()
    serializer_class = FormSubmissionSerializer


class FormFieldOptionViewSet(viewsets.ModelViewSet):
    queryset = FormFieldOption.objects.all()
    serializer_class = FormFieldOptionSerializer
