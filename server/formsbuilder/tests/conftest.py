import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from formsbuilder.models import FormField, FormFieldOption, FormSubmission, FormTemplate

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def authenticated_client(api_client):
    user = User.objects.create_user(
        username="testuser", email="test@example.com", password="testpass123"
    )
    refresh = RefreshToken.for_user(user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {refresh.access_token}")
    return api_client


@pytest.fixture
def test_user():
    return User.objects.create_user(
        username="testuser2", email="test2@example.com", password="testpass123"
    )


@pytest.fixture
def form_template(test_user):
    return FormTemplate.objects.create(
        name="Test Form", description="A test form", created_by=test_user
    )


@pytest.fixture
def form_field(form_template):
    return FormField.objects.create(
        form_template=form_template,
        field_name="test_field",
        label="Test Field",
        widget_type="text",
        is_required=False,
        order=1,
    )


@pytest.fixture
def form_field_option(form_field):
    return FormFieldOption.objects.create(
        form_field=form_field, value="option1", label="Option 1", order=1
    )


@pytest.fixture
def form_submission(form_template, test_user):
    return FormSubmission.objects.create(
        form_template=form_template,
        submitted_by=test_user,
        submission_data={"field1": "value1"},
        ip_address="127.0.0.1",
    )
