import React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import type { FormField as FormFieldType, FormTemplate } from "@/types/form";
import { evaluateConditions, validateFields } from "@/utils/formLogic";
import RadioButton from "@/components/ui/widgets/RadioButton";
import { CheckBox } from "@/components/ui/widgets/CheckBox";
import Select from "@/components/ui/widgets/Select";
import { FileUpload } from "@/components/ui/widgets/FileUpload";
import SubmissionForm from "@/components/ui/widgets/SubmissionForm";

interface DynamicFormProps {
  formTemplate: FormTemplate;
  loading?: boolean;
  onSubmit: (data: Record<string, any>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  formTemplate,
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());

  // Memoize the evaluateConditions function
  const memoizedEvaluateConditions = useCallback(
    (fields: FormFieldType[], currentData: Record<string, any>) => {
      return evaluateConditions(fields, currentData);
    },
    []
  );

  useEffect(() => {
    // Debounce the evaluation to prevent excessive re-renders
    const timer = setTimeout(() => {
      const newVisibleFields = memoizedEvaluateConditions(
        formTemplate.fields,
        formData,
      );
      setVisibleFields(newVisibleFields);
    }, 50);

    return () => clearTimeout(timer);
  }, [formData, formTemplate.fields, memoizedEvaluateConditions]);

  const handleInputChange = useCallback((fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = validateFields(formTemplate.fields, visibleFields, formData)
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formTemplate.fields, formData]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  }, [formData, onSubmit, validateForm]);

  const renderField = useCallback((field: FormFieldType) => {
    const fieldError = errors[field.field_name];
    const isFileInput = field.widget_type === 'file';

    // Base props that are common to all fields
    const baseProps = useMemo(() => ({
      id: field.field_name,
      name: field.field_name,
      placeholder: field.placeholder,
      disabled: loading,
      className: `w-full p-3 text-gray-700 border rounded-lg ${fieldError
        ? 'border-red-500 focus:ring-red-500'
        : 'border-gray-300 focus:ring-blue-500'
        } focus:ring-2 focus:border-transparent transition-colors disabled:opacity-50 disabled:bg-gray-50`,
      required: field.is_required && visibleFields.has(field.field_name),
      'aria-invalid': !!fieldError,
      'aria-describedby': fieldError ? `${field.field_name}-error` : undefined,
    }), [field, loading, fieldError]);

    // For non-file inputs
    const commonProps = useMemo(() => {
      if (isFileInput) return baseProps;

      return {
        ...baseProps,
        value: formData[field.field_name] ?? "",
        onChange: (
          e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
        ) => {
          const value = e.target.type === 'checkbox'
            ? (e.target as HTMLInputElement).checked
            : e.target.value;
          handleInputChange(field.field_name, value);
        },
      };
    }, [baseProps, field.field_name, formData, handleInputChange, isFileInput]);

    switch (field.widget_type) {
      case "text":
      case "email":
      case "password":
      case "url":
      case "phone":
        return (
          <input
            type={field.widget_type === "phone" ? "tel" : field.widget_type}
            {...commonProps}
          />
        );

      case "number":
        return (
          <input
            type="number"
            {...commonProps}
            min={field.widget_config?.min}
            max={field.widget_config?.max}
            step={field.widget_config?.step}
          />
        );

      case "date":
        return <input type="date" {...commonProps} />;

      case "datetime":
        return <input type="datetime-local" {...commonProps} />;

      case "textarea":
        return (
          <textarea
            {...commonProps}
            rows={field.widget_config?.rows || 4}
            onChange={(e) =>
              handleInputChange(field.field_name, e.target.value)
            }
          />
        );

      case "select":
        return (
          <Select
            field={field}
            props={commonProps}
          />
        );

      case "radio":
        return (
          <RadioButton
            field={field}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );

      case "checkbox":
        return (
          <CheckBox
            field={field}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );

      case "file":
        return (
          <FileUpload
            field={field}
            formData={formData}
            commonProps={commonProps}
            handleInputChange={handleInputChange}
          />
        );

      default:
        return <input type="text" {...commonProps} />;
    }
  }, [formData, errors, loading, handleInputChange]);

  return (
    <SubmissionForm
      formTemplate={formTemplate}
      visibleFields={visibleFields}
      errors={errors}
      loading={loading}
      renderField={renderField}
      handleSubmit={handleSubmit}
    />
  );
};

export default DynamicForm;
