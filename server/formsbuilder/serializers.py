from rest_framework import serializers
from .models import FormTemplate, FormField, FormSubmission, FormFieldOption


class FormFieldOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormFieldOption
        fields = ['id', 'value', 'label', 'order']


class FormFieldSerializer(serializers.ModelSerializer):
    options = FormFieldOptionSerializer(many=True, read_only=True)

    class Meta:
        model = FormField
        fields = [
            'id', 'field_name', 'label', 'widget_type', 'placeholder',
            'help_text', 'is_required', 'order', 'widget_config',
            'validation_rules', 'options'
        ]


class FormTemplateSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True, read_only=True)
    created_by = serializers.ReadOnlyField(source='created_by.username')

    class Meta:
        model = FormTemplate
        fields = [
            'id', 'name', 'slug', 'description', 'is_active',
            'created_by', 'created_at', 'updated_at', 'category', 'fields'
        ]


class FormSubmissionSerializer(serializers.ModelSerializer):
    submitted_by = serializers.ReadOnlyField(source='submitted_by.username', allow_null=True)

    class Meta:
        model = FormSubmission
        fields = [
            'id', 'form_template', 'submitted_by', 'submission_data',
            'submitted_at', 'ip_address'
        ]
