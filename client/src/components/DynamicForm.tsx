import React, { useState } from "react";
import type { FormField as FormFieldType, FormTemplate } from "@/types/form";

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

  const evaluateConditions = (
    fields: FormFieldType[],
    currentData: Record<string, any>,
  ) => {
    const visible = new Set<string>();

    fields.forEach((field) => {
      if (!field.conditional_logic?.conditions?.length) {
        visible.add(field.field_name);
      }
    });

    fields.forEach((field) => {
      const conditionalLogic = field.conditional_logic;
      if (!conditionalLogic?.conditions?.length) return;

      const conditions = conditionalLogic.conditions;
      const action = conditionalLogic.action || "show";

      const conditionsMet = conditions.every((condition) => {
        if (!condition.field) return false;

        const fieldValue = currentData[condition.field];
        const conditionValue = condition.value;

        switch (condition.operator) {
          case "equals":
            return fieldValue == conditionValue;

          case "not_equals":
            return fieldValue != conditionValue;

          case "contains":
            return (
              fieldValue != null &&
              String(fieldValue).includes(String(conditionValue))
            );

          case "not_contains":
            return (
              fieldValue != null &&
              !String(fieldValue).includes(String(conditionValue))
            );

          case "greater_than":
            return Number(fieldValue) > Number(conditionValue);

          case "less_than":
            return Number(fieldValue) < Number(conditionValue);

          case "greater_than_or_equals":
            return Number(fieldValue) >= Number(conditionValue);

          case "less_than_or_equals":
            return Number(fieldValue) <= Number(conditionValue);

          case "is_empty":
            return (
              fieldValue === "" || fieldValue == null || fieldValue === false
            );

          case "is_not_empty":
            return (
              fieldValue !== "" && fieldValue != null && fieldValue !== false
            );

          default:
            console.warn(`Unknown operator: ${condition.operator}`);
            return true;
        }
      });

      if (conditionsMet) {
        if (action === "show") {
          visible.add(field.field_name);
        } else {
          visible.delete(field.field_name);
        }
      } else if (action === "hide") {
        visible.add(field.field_name);
      }
    });

    return visible;
  };

  // Update visible fields when form data changes
  React.useEffect(() => {
    // Debounce the evaluation to prevent excessive re-renders
    const timer = setTimeout(() => {
      const newVisibleFields = evaluateConditions(
        formTemplate.fields,
        formData,
      );
      setVisibleFields(newVisibleFields);
    }, 50);

    return () => clearTimeout(timer);
  }, [formData, formTemplate.fields]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    formTemplate.fields.forEach((field) => {
      if (
        field.is_required &&
        (!formData[field.field_name] || formData[field.field_name] === "")
      ) {
        newErrors[field.field_name] = `${field.label} is required`;
      }

      // Add more validation based on field type and validation_rules
      if (field.widget_type === "email" && formData[field.field_name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.field_name])) {
          newErrors[field.field_name] = "Invalid email format";
        }
      }

      // Length validation
      if (field.validation_rules?.min_length && formData[field.field_name]) {
        if (
          String(formData[field.field_name]).length <
          field.validation_rules.min_length
        ) {
          newErrors[field.field_name] =
            `Minimum ${field.validation_rules.min_length} characters required`;
        }
      }

      if (field.validation_rules?.max_length && formData[field.field_name]) {
        if (
          String(formData[field.field_name]).length >
          field.validation_rules.max_length
        ) {
          newErrors[field.field_name] =
            `Maximum ${field.validation_rules.max_length} characters allowed`;
        }
      }

      // Pattern validation
      if (field.validation_rules?.pattern && formData[field.field_name]) {
        const pattern = new RegExp(field.validation_rules.pattern);
        if (!pattern.test(formData[field.field_name])) {
          newErrors[field.field_name] = "Invalid format";
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormFieldType) => {
    const isVisible = visibleFields.has(field.field_name);
    const fieldError = errors[field.field_name];

    const commonProps = {
      id: field.field_name,
      name: field.field_name,
      placeholder: field.placeholder,
      value: formData[field.field_name] ?? "",
      onChange: (
        e: React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => {
        const value =
          e.target.type === "checkbox"
            ? (e.target as HTMLInputElement).checked
            : e.target.value;
        handleInputChange(field.field_name, value);
      },
      disabled: loading,
      className: `w-full p-3 text-gray-700 border rounded-lg ${
        fieldError
          ? "border-red-500 focus:ring-red-500"
          : "border-gray-300 focus:ring-blue-500"
      } focus:ring-2 focus:border-transparent transition-colors disabled:opacity-50 disabled:bg-gray-50`,
      required: field.is_required,
      "aria-invalid": !!fieldError,
      "aria-describedby": fieldError ? `${field.field_name}-error` : undefined,
    };

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
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "radio":
        return (
          <div className="space-y-3">
            {field.options?.map((option) => (
              <label key={option.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={field.field_name}
                  value={option.value}
                  checked={formData[field.field_name] === option.value}
                  onChange={() =>
                    handleInputChange(field.field_name, option.value)
                  }
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        if (field.options && field.options.length > 1) {
          // Multiple checkboxes
          return (
            <div className="space-y-3">
              {field.options.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    value={option.value}
                    checked={(formData[field.field_name] || []).includes(
                      option.value,
                    )}
                    onChange={(e) => {
                      const currentValues = formData[field.field_name] || [];
                      if (e.target.checked) {
                        handleInputChange(field.field_name, [
                          ...currentValues,
                          option.value,
                        ]);
                      } else {
                        handleInputChange(
                          field.field_name,
                          currentValues.filter(
                            (v: string) => v !== option.value,
                          ),
                        );
                      }
                    }}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          );
        } else {
          // Single checkbox
          return (
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData[field.field_name] || false}
                onChange={(e) =>
                  handleInputChange(field.field_name, e.target.checked)
                }
                className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
              />
              <span className="text-sm font-medium text-gray-700">
                {field.label}
              </span>
            </label>
          );
        }

      case "file":
        return (
          <input
            type="file"
            {...commonProps}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleInputChange(field.field_name, file);
              }
            }}
            accept={field.widget_config?.accept}
            multiple={field.widget_config?.multiple}
            className="w-full p-3 border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        );

      default:
        return <input type="text" {...commonProps} />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">
          {formTemplate.name}
        </h2>
        {formTemplate.description && (
          <p className="text-gray-600 leading-relaxed">
            {formTemplate.description}
          </p>
        )}
        {formTemplate.category && (
          <span className="inline-block mt-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
            {formTemplate.category}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formTemplate.fields.map((field) => {
          const isVisible = visibleFields.has(field.field_name);
          const fieldError = errors[field.field_name];

          return (
            <div
              key={field.id}
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isVisible ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <div className="space-y-2">
                <label
                  htmlFor={field.field_name}
                  className={`block text-sm font-semibold ${
                    fieldError ? "text-red-700" : "text-gray-700"
                  }`}
                >
                  {field.label}
                  {field.is_required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {renderField(field)}

                {field.help_text && (
                  <p className="text-sm text-gray-500 mt-1">
                    {field.help_text}
                  </p>
                )}

                {fieldError && (
                  <p
                    id={`${field.field_name}-error`}
                    className="text-sm text-red-600 mt-1 font-medium"
                    role="alert"
                  >
                    {fieldError}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium text-lg"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            "Submit Form"
          )}
        </button>
      </form>
    </div>
  );
};

export default DynamicForm;
