import pytest
from django.utils.text import slugify

from formsbuilder.models import FormTemplate

pytestmark = pytest.mark.django_db


class TestFormTemplateModel:
    def test_create_form_template(self, form_template):
        assert form_template.name == "Test Form"
        assert form_template.slug == slugify("Test Form")
        assert form_template.is_active is True
        assert form_template.created_by is not None

    def test_form_template_str_representation(self, form_template):
        assert str(form_template) == form_template.name

    def test_slug_auto_generated(self, test_user):
        form = FormTemplate.objects.create(
            name="Another Test Form", created_by=test_user
        )
        assert form.slug == "another-test-form"


class TestFormFieldModel:
    def test_create_form_field(self, form_field):
        assert form_field.label == "Test Field"
        assert form_field.widget_type == "text"
        assert form_field.is_required is False
        assert form_field.order == 1
        assert form_field.field_name == "test_field"

    def test_form_field_str_representation(self, form_field):
        assert (
            str(form_field) == f"{form_field.form_template.name} - {form_field.label}"
        )


class TestFormFieldOptionModel:
    def test_create_form_field_option(self, form_field_option):
        assert form_field_option.value == "option1"
        assert form_field_option.label == "Option 1"
        assert form_field_option.order == 1

    def test_form_field_option_str_representation(self, form_field_option):
        # The actual implementation shows 'No Field' when form_field is None
        # or the field's label when it exists
        result = str(form_field_option)
        if form_field_option.form_field:
            assert form_field_option.form_field.label in result
        assert form_field_option.label in result


class TestFormSubmissionModel:
    def test_create_form_submission(self, form_submission):
        assert form_submission.form_template is not None
        assert form_submission.submitted_by is not None
        assert form_submission.submission_data == {"field1": "value1"}
        assert form_submission.ip_address == "127.0.0.1"

    def test_form_submission_str_representation(self, form_submission):
        expected = (
            f"{form_submission.form_template.name} - {form_submission.submitted_at}"
        )
        assert str(form_submission) == expected
