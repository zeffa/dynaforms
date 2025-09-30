import pytest

from formsbuilder.models import FormFieldOption
from formsbuilder.serializers import (
    FormFieldOptionSerializer,
    FormFieldSerializer,
    FormSubmissionSerializer,
    FormTemplateSerializer,
)

pytestmark = pytest.mark.django_db


class TestFormTemplateSerializer:
    def test_serialize_form_template(self, form_template):
        serializer = FormTemplateSerializer(form_template)
        data = serializer.data
        assert data["name"] == form_template.name
        assert data["slug"] == form_template.slug
        assert "created_at" in data
        assert "updated_at" in data

    def test_deserialize_form_template(self, test_user):
        data = {
            "name": "New Test Form",
            "description": "A new test form",
            "is_active": True,
            "created_by": test_user.id,
        }
        serializer = FormTemplateSerializer(data=data)
        assert serializer.is_valid()
        form_template = serializer.save()
        assert form_template.name == "New Test Form"
        assert form_template.slug == "new-test-form"


class TestFormFieldSerializer:
    def test_serialize_form_field(self, form_field):
        serializer = FormFieldSerializer(form_field)
        data = serializer.data
        assert data["label"] == form_field.label
        assert data["widget_type"] == form_field.widget_type
        assert data["is_required"] == form_field.is_required
        assert data["field_name"] == form_field.field_name

    def test_deserialize_form_field(self, form_template):
        data = {
            "name": "Test Form with Fields",
            "fields_data": [
                {
                    "field_name": "new_field",
                    "label": "New Field",
                    "widget_type": "email",
                    "is_required": True,
                    "order": 2,
                    "options": [{"value": "opt1", "label": "Option 1", "order": 1}],
                }
            ],
        }
        serializer = FormTemplateSerializer(data=data)
        assert serializer.is_valid(), serializer.errors
        form_template = serializer.save()
        assert form_template.fields.count() == 1
        field = form_template.fields.first()
        assert field.label == "New Field"
        assert field.widget_type == "email"


class TestFormFieldOptionSerializer:
    def test_serialize_form_field_option(self, form_field_option):
        serializer = FormFieldOptionSerializer(form_field_option)
        data = serializer.data
        assert data["value"] == form_field_option.value
        assert data["label"] == form_field_option.label

    def test_deserialize_form_field_option(self, form_field):
        option = FormFieldOption.objects.create(
            form_field=form_field, value="option2", label="Option 2", order=2
        )
        serializer = FormFieldOptionSerializer(option)
        data = serializer.data
        assert data["value"] == "option2"
        assert data["label"] == "Option 2"


class TestFormSubmissionSerializer:
    def test_serialize_form_submission(self, form_submission):
        serializer = FormSubmissionSerializer(form_submission)
        data = serializer.data
        assert data["form_template"] == form_submission.form_template.id
        assert data["submission_data"] == form_submission.submission_data

    def test_deserialize_form_submission(self, form_template, test_user):
        data = {
            "form_template": form_template.id,
            "submitted_by": test_user.id,
            "submission_data": {"field1": "test_value"},
            "ip_address": "192.168.1.1",
        }
        serializer = FormSubmissionSerializer(data=data)
        assert serializer.is_valid()
        submission = serializer.save()
        assert submission.form_template == form_template
        assert submission.submission_data == {"field1": "test_value"}
