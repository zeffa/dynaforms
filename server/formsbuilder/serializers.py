from rest_framework import serializers

from .models import FormField, FormFieldOption, FormSubmission, FormTemplate


class FormFieldOptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormFieldOption
        fields = ["id", "value", "label", "order"]


class FormFieldSerializer(serializers.ModelSerializer):
    options = FormFieldOptionSerializer(many=True, required=False)

    class Meta:
        model = FormField
        fields = [
            "id",
            "field_name",
            "label",
            "widget_type",
            "placeholder",
            "help_text",
            "is_required",
            "order",
            "widget_config",
            "validation_rules",
            "conditional_logic",
            "options",
        ]

    def create(self, validated_data):
        options_data = validated_data.pop("options", [])
        field = FormField.objects.create(**validated_data)
        for option_data in options_data:
            FormFieldOption.objects.create(form_field=field, **option_data)
        return field

    def update(self, instance, validated_data):
        options_data = validated_data.pop("options", None)

        instance = super().update(instance, validated_data)

        if options_data is not None:
            instance.options.all().delete()
            for option_data in options_data:
                FormFieldOption.objects.create(form_field=instance, **option_data)

        return instance


class FormTemplateSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True, read_only=True)
    created_by = serializers.ReadOnlyField(
        source="created_by.username", allow_null=True
    )
    fields_data = FormFieldSerializer(many=True, write_only=True, required=False)

    class Meta:
        model = FormTemplate
        fields = [
            "id",
            "name",
            "slug",
            "description",
            "is_active",
            "created_by",
            "created_at",
            "updated_at",
            "category",
            "fields",
            "fields_data",
        ]
        read_only_fields = ("slug",)

    def create(self, validated_data):
        fields_data = validated_data.pop("fields_data", [])
        form_template = FormTemplate.objects.create(**validated_data)

        for field_data in fields_data:
            options_data = field_data.pop("options", [])

            field_serializer = FormFieldSerializer(data=field_data)
            field_serializer.is_valid(raise_exception=True)
            field = field_serializer.save(form_template=form_template)

            for option_data in options_data:
                option_serializer = FormFieldOptionSerializer(data=option_data)
                option_serializer.is_valid(raise_exception=True)
                option_serializer.save(form_field=field)

        return form_template

    def update(self, instance, validated_data):
        fields_data = validated_data.pop("fields_data", None)
        instance = super().update(instance, validated_data)

        if fields_data is not None:
            instance.fields.all().delete()

            for field_data in fields_data:
                options_data = field_data.pop("options", [])

                field_serializer = FormFieldSerializer(data=field_data)
                field_serializer.is_valid(raise_exception=True)
                field = field_serializer.save(form_template=instance)

                for option_data in options_data:
                    option_serializer = FormFieldOptionSerializer(data=option_data)
                    option_serializer.is_valid(raise_exception=True)
                    option_serializer.save(form_field=field)

        return instance


class FormSubmissionSerializer(serializers.ModelSerializer):
    submitted_by = serializers.ReadOnlyField(
        source="submitted_by.username", allow_null=True
    )

    class Meta:
        model = FormSubmission
        fields = [
            "id",
            "form_template",
            "submitted_by",
            "submission_data",
            "submitted_at",
            "ip_address",
        ]
