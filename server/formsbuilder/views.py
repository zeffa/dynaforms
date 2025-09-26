from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
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

    @action(detail=True, methods=["post"], url_path="submit")
    def submit_form(self, request, pk):
        form_template = self.get_object()
        form_data = request.data
        for field in form_template.fields.all():
            if field.field_name not in form_data:
                return Response({"message": f"Missing field: {field.field_name}"}, status=400)
        form_submission = FormSubmission.objects.create(
            form_template=form_template,
            submission_data=form_data,
            # submitted_by=request.user,
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        return Response({"message": "Form submitted successfully", "submission_id": form_submission.id})


class FormFieldViewSet(viewsets.ModelViewSet):
    queryset = FormField.objects.all()
    serializer_class = FormFieldSerializer


class FormSubmissionViewSet(viewsets.ModelViewSet):
    queryset = FormSubmission.objects.all()
    serializer_class = FormSubmissionSerializer


class FormFieldOptionViewSet(viewsets.ModelViewSet):
    queryset = FormFieldOption.objects.all()
    serializer_class = FormFieldOptionSerializer
