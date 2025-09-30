from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify

User = get_user_model()


class FormTemplate(models.Model):
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    category = models.CharField(
        max_length=100, blank=True, help_text="Optional category for organizing forms"
    )

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class FormField(models.Model):
    WIDGET_TYPES = [
        ("text", "Text Input"),
        ("email", "Email Input"),
        ("password", "Password Input"),
        ("textarea", "Textarea"),
        ("number", "Number Input"),
        ("date", "Date Picker"),
        ("datetime", "DateTime Picker"),
        ("select", "Select Dropdown"),
        ("radio", "Radio Buttons"),
        ("checkbox", "Checkbox"),
        ("file", "File Upload"),
        ("multi_select", "Multi Select"),
        ("phone", "Phone Number"),
        ("url", "URL Input"),
    ]

    form_template = models.ForeignKey(
        FormTemplate, on_delete=models.CASCADE, related_name="fields"
    )
    field_name = models.CharField(max_length=100)
    label = models.CharField(max_length=200)
    widget_type = models.CharField(max_length=50, choices=WIDGET_TYPES)
    placeholder = models.CharField(max_length=200, blank=True)
    help_text = models.CharField(max_length=500, blank=True)
    is_required = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    widget_config = models.JSONField(default=dict, blank=True)
    validation_rules = models.JSONField(default=dict, blank=True)
    conditional_logic = models.JSONField(
        default=dict,
        blank=True,
        help_text="JSON structure defining field visibility/validation conditions",
    )

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return f"{self.form_template.name} - {self.label}"


class FormSubmission(models.Model):
    form_template = models.ForeignKey(FormTemplate, on_delete=models.CASCADE)
    submitted_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True
    )
    submission_data = models.JSONField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    def __str__(self):
        return f"{self.form_template.name} - {self.submitted_at}"


class FormFieldOption(models.Model):
    """For select, radio, checkbox options"""

    form_field = models.ForeignKey(
        FormField, on_delete=models.CASCADE, related_name="options"
    )
    value = models.CharField(max_length=200)
    label = models.CharField(max_length=200)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        field_label = (
            self.form_field.label
            if hasattr(self, "form_field") and self.form_field
            else "No Field"
        )
        return f"{field_label} - {self.label}"
