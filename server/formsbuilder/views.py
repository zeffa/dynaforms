from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
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

    def get_permissions(self):
        if self.action in ["submit_form", "list", "retrieve", "submissions"]:
            return [AllowAny()]
        return [IsAuthenticated()]
        
    @action(detail=True, methods=['get'])
    def submissions(self, request, pk=None):
        """
        Retrieve all submissions for a specific form template.
        """
        form_template = self.get_object()
        submissions = FormSubmission.objects.filter(form_template=form_template)
        page = self.paginate_queryset(submissions)
        if page is not None:
            serializer = FormSubmissionSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)
            
        serializer = FormSubmissionSerializer(submissions, many=True)
        return Response(serializer.data)

    def get_object(self):
        lookup_value = self.kwargs.get("pk")
        qs = self.get_queryset()
        obj = qs.filter(slug=lookup_value).first()
        if obj:
            return obj
        return get_object_or_404(qs, pk=lookup_value)

    def _evaluate_condition(self, condition, form_data):
        """Evaluate a single condition against form data."""
        field_name = condition.get('field')
        operator = condition.get('operator')
        value = condition.get('value')
        
        if field_name not in form_data:
            field_value = None
            field_exists = False
        else:
            field_value = form_data[field_name]
            field_exists = True
            
        if operator == 'is_empty':
            return not field_exists or field_value in (None, '')
        elif operator == 'is_not_empty':
            return field_exists and field_value not in (None, '')
            
        if not field_exists:
            return False
            
        str_field = str(field_value)
        str_value = str(value) if value is not None else ''
        
        try:
            num_field = float(field_value)
            num_value = float(value) if value is not None else 0
        except (ValueError, TypeError):
            num_field = num_value = None
        
        if operator == 'equals':
            return str_field == str_value
        elif operator == 'not_equals':
            return str_field != str_value
        elif operator == 'contains':
            return str_value in str_field
        elif operator == 'not_contains':
            return str_value not in str_field
        elif operator == 'greater_than':
            return num_field is not None and num_value is not None and num_field > num_value
        elif operator == 'less_than':
            return num_field is not None and num_value is not None and num_field < num_value
        elif operator == 'greater_than_or_equals':
            return num_field is not None and num_value is not None and num_field >= num_value
        elif operator == 'less_than_or_equals':
            return num_field is not None and num_value is not None and num_field <= num_value
            
        return False  # Unknown operator
    
    def _should_validate_field(self, field, form_data):
        """Determine if a field should be validated based on its conditional logic."""
        conditional_logic = field.conditional_logic or {}
        
        if not conditional_logic or not conditional_logic.get('conditions'):
            return True
            
        operator = conditional_logic.get('operator', 'and').lower()
        conditions = conditional_logic.get('conditions', [])
        
        results = [self._evaluate_condition(cond, form_data) for cond in conditions]
        
        if operator == 'and':
            return all(results)
        elif operator == 'or':
            return any(results)
        return True
    
    @action(
        detail=True,
        methods=["post"], 
        url_path="submit",
    )
    def submit_form(self, request, pk):
        form_template = self.get_object()
        form_data = request.data
        
        for field in form_template.fields.all():
            if field.is_required and field.field_name not in form_data:
                if self._should_validate_field(field, form_data):
                    data = {
                        "message": "Missing required field", 
                        "field_name": field.field_name,
                        "label": field.label
                    }
                    return Response(data=data, status=400)
        
        form_submission = FormSubmission.objects.create(
            form_template=form_template,
            submission_data=form_data,
            submitted_by=request.user if request.user.is_authenticated else None,
            ip_address=request.META.get("REMOTE_ADDR"),
        )
        
        return Response(
            {
                "message": "Form submitted successfully",
                "submission_id": form_submission.id,
            },
            status=201
        )


class FormFieldViewSet(viewsets.ModelViewSet):
    queryset = FormField.objects.all()
    serializer_class = FormFieldSerializer


class FormSubmissionViewSet(viewsets.ModelViewSet):
    queryset = FormSubmission.objects.all()
    serializer_class = FormSubmissionSerializer


class FormFieldOptionViewSet(viewsets.ModelViewSet):
    queryset = FormFieldOption.objects.all()
    serializer_class = FormFieldOptionSerializer


class FormStatisticsViewSet(viewsets.ViewSet):
    """
    A simple ViewSet for retrieving form statistics.
    """
    permission_classes = [IsAuthenticated]

    def list(self, request):
        total_forms = FormTemplate.objects.count()
        active_forms = FormTemplate.objects.filter(is_active=True).count()
        total_submissions = FormSubmission.objects.count()

        return Response(
            {
                "total_forms": total_forms,
                "active_forms": active_forms,
                "total_submissions": total_submissions,
            }
        )
